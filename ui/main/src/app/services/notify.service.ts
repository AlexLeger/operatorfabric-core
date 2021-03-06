/* Copyright (c) 2020, RTE (http://www.rte-france.com)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import {Injectable} from '@angular/core';

@Injectable()
export class NotifyService {

    permission: string;
    constructor() {
    }

    isSupported(window): boolean {
        return 'Notification' in window;
    }
    requestPermission(): void {
        if (this.isSupported(window)) {
            Notification.requestPermission(status => {
                this.permission = status;
            });
        }
    }

    createNotification(title: string) {
        if (this.isSupported(window) && this.permission === 'granted') {
            return new Notification(title);
        }
    }
}
