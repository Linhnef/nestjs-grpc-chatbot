/* eslint-disable prettier/prettier */
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from "../dto/jwt-payload.dto";
import { GrpcAuthService, User } from "./grpc-auth.service";
import { ClientGrpc } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) implements OnModuleInit {
    private grpcAuthService: GrpcAuthService;
    constructor(
        @Inject('AUTH_SERVICE')
        private grpcClient: ClientGrpc,
    ) {
        super({
            secretOrKey: 'secretKey',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    onModuleInit() {
        this.grpcAuthService = this.grpcClient.getService<GrpcAuthService>('AuthService');
    }

    async validate(payload: JwtPayload): Promise<User> {
        return await firstValueFrom(this.grpcAuthService.validate(payload))
    }
}