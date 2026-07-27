import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Driver, DriverDocument } from "./schemas/driver.schema";
import { CreateDriverDto, UpdateLocationDto } from "./dto/driver.dto";
import { DriverStatus, VerificationStatus } from "../common/enums/driver.enum";

@Injectable()
export class DriversService {
  constructor(
    @InjectModel(Driver.name) private driverModel: Model<DriverDocument>,
  ) {}

  async onboard(dto: CreateDriverDto): Promise<DriverDocument> {
  // Validate age
  if (dto.age < 18 || dto.age > 60) {
    throw new BadRequestException(
      "Driver age must be between 18 and 60 years",
    );
  }

  // Validate gender
  if (dto.gender.toLowerCase() !== "male") {
    throw new BadRequestException(
      "Only male drivers are allowed to onboard",
    );
  }

  // Check duplicate email or phone
  const existing = await this.driverModel.findOne({
    $or: [
      { email: dto.email },
      { phone: dto.phone },
    ],
  });

  if (existing) {
    throw new ConflictException(
      "Driver with this email or phone already exists",
    );
  }

  // Create driver
  return this.driverModel.create({
    ...dto,
    status: DriverStatus.OFFLINE,
    verificationStatus: VerificationStatus.PENDING,
  });
}



  async findById(id: string): Promise<DriverDocument> {
    const driver = await this.driverModel.findById(id);
    if (!driver) throw new NotFoundException("Driver not found");
    return driver;
  }

  async setVerificationStatus(id: string, status: VerificationStatus) {
    const driver = await this.findById(id);
    driver.verificationStatus = status;
    // A rejected/pending driver cannot stay available
    if (status !== VerificationStatus.VERIFIED) {
      driver.status = DriverStatus.OFFLINE;
    }
    return driver.save();
  }

  /**
   * Toggles a driver online/available or offline. Only verified drivers can
   * go AVAILABLE. A driver who currently has an active ride cannot go offline.
   */
  async setStatus(id: string, status: DriverStatus): Promise<DriverDocument> {
    const driver = await this.findById(id);

    if (
      status === DriverStatus.AVAILABLE &&
      driver.verificationStatus !== VerificationStatus.VERIFIED
    ) {
      throw new BadRequestException(
        "Driver must be verified before going online",
      );
    }

    if (driver.status === DriverStatus.BUSY && status !== DriverStatus.BUSY) {
      throw new BadRequestException(
        "Cannot change status while an active ride is in progress",
      );
    }

    driver.status = status;
    return driver.save();
  }

  async updateLocation(
    id: string,
    dto: UpdateLocationDto,
  ): Promise<DriverDocument> {
    const driver = await this.findById(id);
    driver.currentLocation = {
      type: "Point",
      coordinates: [dto.lng, dto.lat],
      updatedAt: new Date(),
    } as any;
    return driver.save();
  }

  async getallddrivers() {
    return [
      {
        name: "Anas",
        age: 56,
      },
      {
        name: "Ali",
        age: 30,
      },
      {
        name: "Ahmed",
        age: 25,
      },
    ];
  }

  /**
   * Geospatial search for available, verified drivers within radiusKm of a point,
   * sorted nearest-first (MongoDB $near does this natively).
   */
  async findNearbyAvailable(
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<DriverDocument[]> {
    return this.driverModel.find({
      status: DriverStatus.AVAILABLE,
      verificationStatus: VerificationStatus.VERIFIED,
      currentLocation: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000,
        },
      },
    });
  }

  /** Atomically marks a driver BUSY and assigns the ride, only if still available. */
  async assignToRide(
    driverId: string,
    rideId: Types.ObjectId,
  ): Promise<DriverDocument | null> {
    return this.driverModel.findOneAndUpdate(
      { _id: driverId, status: DriverStatus.AVAILABLE },
      { status: DriverStatus.BUSY, activeRideId: rideId },
      { new: true },
    );
  }

  /** Frees a driver after a ride ends, is cancelled, or a request expires/is rejected. */
  async releaseFromRide(driverId: string): Promise<DriverDocument | null> {
    return this.driverModel.findOneAndUpdate(
      { _id: driverId },
      { status: DriverStatus.AVAILABLE, activeRideId: null },
      { new: true },
    );
  }

  async recordCompletedRide(driverId: string, fare: number) {
    return this.driverModel.findByIdAndUpdate(driverId, {
      $inc: { totalRidesCompleted: 1, totalEarnings: fare },
    });
  }

  async applyRating(driverId: string, rating: number) {
    const driver = await this.findById(driverId);
    const newCount = driver.ratingCount + 1;
    const newAvg =
      (driver.ratingAverage * driver.ratingCount + rating) / newCount;
    driver.ratingAverage = Math.round(newAvg * 100) / 100;
    driver.ratingCount = newCount;
    return driver.save();
  }
}
