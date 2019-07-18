/* Copyright (c) 2018, RTE (http://www.rte-france.com)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Injectable} from '@angular/core';
import {Filter} from "@ofModel/feed-filter.model";
import {LightCard, Severity} from "@ofModel/light-card.model";
import * as _ from "lodash";

@Injectable({
    providedIn: 'root'
})
export class FilterService {

    private _defaultFilters = new Map();

    constructor() {
        this._defaultFilters = this.initFilters();
    }

    public defaultFilters(): Map<FilterType, Filter> {
        return this._defaultFilters;
    }


    private initTypeFilter() {
        const alarm = Severity.ALARM;
        const action = Severity.ACTION;
        const question = Severity.QUESTION;
        const notification = Severity.NOTIFICATION;
        return new Filter(
            (card, status) => {
                const result =
                    status.alarm && card.severity == alarm ||
                    status.action && card.severity == action ||
                    status.question && card.severity == question ||
                    status.notification && card.severity == notification;
                return result;
            },
            true,
            {
                alarm: true,
                action: true,
                question: true,
                notification: true
            }
        );
    }

    private initTagFilter() {
        return new Filter(
            (card, status) => _.intersection(card.tags,status.tags).length > 0,
            false,
            {tags:[]}
        );
    }

    private initRecipientFilter() {
        return new Filter(
            (card, status) => false,
            false,
            {}
        );
    }

    private initTimeFilter() {
        return new Filter(
            (card:LightCard, status) => {
                if (!!status.start && !!status.end) {
                    if (!card.endDate)
                        return card.startDate <= status.end;
                    return status.start <= card.startDate && card.startDate <= status.end
                        || status.start <= card.endDate && card.endDate <= status.end
                        || card.startDate <= status.start && status.end <= card.endDate;
                } else if (!!status.start) {
                    return !card.endDate || status.start <= card.endDate;
                } else if (!!status.end) {
                    return card.startDate <= status.end;
                }
                console.warn("Unexpected time filter situation");
                return false;
            },
            false,
            {start: new Date().valueOf()-2*60*60*1000, end: new Date().valueOf()+48*60*60*1000})
    }


    private initFilters(): Map<string, Filter> {
        const filters = new Map();
        filters.set(FilterType.TYPE_FILTER, this.initTypeFilter());
        // filters.set(FilterType.RECIPIENT_FILTER, this.initRecipientFilter());
        filters.set(FilterType.TIME_FILTER, this.initTimeFilter());
        filters.set(FilterType.TAG_FILTER, this.initTagFilter());
        return filters;
    }
}

export enum FilterType {
    TYPE_FILTER,
    RECIPIENT_FILTER,
    TAG_FILTER,
    TIME_FILTER,
    TEST_FILTER
}
