'use strict';
import { noop } from 'lodash-es';

export class SocketServiceMock {
    socket = {
        connect: noop,
        on: noop,
        emit: noop,
        receive: noop
    };
    syncUpdates = noop;
    unsyncUpdates = noop;
}
