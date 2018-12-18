/* Copyright (c) 2018, RTE (http://www.rte-france.com)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {AuthenticationActions, AuthenticationActionTypes} from '@ofActions/authentication.actions';
import {authInitialState, AuthState} from "@ofStates/authentication.state";


export function reducer(state = authInitialState, action: AuthenticationActions): AuthState {
    switch (action.type) {

        case AuthenticationActionTypes.AcceptLogIn: {

            const payload = action.payload;
            return {
                ...state,
                identifier: payload.identifier,
                clientId: payload.clientId,
                token: payload.token,
                expirationDate: payload.expirationDate
            };
        }
        case AuthenticationActionTypes.AcceptLogOut:{
            return {
                ...state,
                identifier: null,
                clientId: null,
                token:null,
                expirationDate: new Date(0),
                denialReason: null
            };
        }
        case AuthenticationActionTypes.RejectLogIn: {
            return {
                ...state,
                identifier: null,
                clientId: null,
                token:null,
                expirationDate: new Date(0),
                denialReason: action.payload.denialReason
            };
        }
        default:
            return state;
    }
}

export const getIdentifier = (state: AuthState) => state.identifier;
export const getToken = (state: AuthState) => state.token;
export const getExpirationDate = (state: AuthState) => state.expirationDate;

export const getExpirationTime = (state: AuthState) => {
    const expirationDate = getExpirationDate(state);
    const token = getToken(state);
    if (token && expirationDate) {
        return expirationDate.getTime();
    } else {
        return new Date(0).getTime;
    }
}