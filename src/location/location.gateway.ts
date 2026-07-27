import { Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

interface DriverLocationPayload {
  driverId: string;
  rideId?: string;
  lat: number;
  lng: number;
}

interface JoinRidePayload {
  rideId: string;
}

interface RegisterDriverPayload {
  driverId: string;
}

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: "/realtime",
})
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server!: Server;

  private readonly logger = new Logger(LocationGateway.name);
  private readonly driverSockets = new Map<string, string>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    for (const [driverId, socketId] of this.driverSockets.entries()) {
      if (socketId === client.id) this.driverSockets.delete(driverId);
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("driver:register")
  registerDriver(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: RegisterDriverPayload,
  ) {
    this.driverSockets.set(payload.driverId, client.id);
    client.join(`driver:${payload.driverId}`);
    return { status: "ok" };
  }

  @SubscribeMessage("ride:join")
  joinRide(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRidePayload,
  ) {
    client.join(`ride:${payload.rideId}`);
    return { status: "ok" };
  }

  @SubscribeMessage("ride:leave")
  leaveRide(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRidePayload,
  ) {
    client.leave(`ride:${payload.rideId}`);
    return { status: "ok" };
  }

  @SubscribeMessage("driver:location")
  handleDriverLocation(@MessageBody() payload: DriverLocationPayload) {
    if (payload.rideId) {
      this.server.to(`ride:${payload.rideId}`).emit("driver:location", {
        driverId: payload.driverId,
        lat: payload.lat,
        lng: payload.lng,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @OnEvent("ride.dispatch")
  onRideDispatch({
    driverId,
    ride,
  }: {
    driverId: string;
    ride: Record<string, unknown>;
  }) {
    this.server.to(`driver:${driverId}`).emit("ride:offer", ride);
  }

  @OnEvent("ride.accepted")
  onRideAccepted(payload: {
    rideId: string;
    driverId: string;
    passengerId: string;
  }) {
    this.server.to(`ride:${payload.rideId}`).emit("ride:accepted", payload);
  }

  @OnEvent("ride.status_changed")
  onRideStatusChanged(payload: { rideId: string; status: string }) {
    this.server.to(`ride:${payload.rideId}`).emit("ride:status", payload);
  }

  @OnEvent("ride.completed")
  onRideCompleted(payload: { rideId: string }) {
    this.server.to(`ride:${payload.rideId}`).emit("ride:completed", payload);
  }

  @OnEvent("ride.cancelled")
  onRideCancelled(payload: { rideId: string; cancelledBy: string }) {
    this.server.to(`ride:${payload.rideId}`).emit("ride:cancelled", payload);
  }

  @OnEvent("ride.expired")
  onRideExpired(payload: { rideId: string; passengerId: string }) {
    this.server.to(`ride:${payload.rideId}`).emit("ride:expired", payload);
  }
}
