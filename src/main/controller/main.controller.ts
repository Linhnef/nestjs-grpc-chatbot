/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('chat bot')
@Controller()
export class MainController {
    constructor() { }

    @Get('welcome')
    @UseGuards(AuthGuard('jwt'))
    async welcome() {
        return 'welcome !'
    }

}
