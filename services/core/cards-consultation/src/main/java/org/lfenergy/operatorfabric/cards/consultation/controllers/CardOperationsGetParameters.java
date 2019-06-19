/* Copyright (c) 2018, RTE (http://www.rte-france.com)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

package org.lfenergy.operatorfabric.cards.consultation.controllers;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Singular;
import lombok.Value;
import org.lfenergy.operatorfabric.users.model.User;

import java.time.Instant;
import java.util.List;

/** This class contains all the information necessary to define a feed
 */
@Value
@Builder
@AllArgsConstructor
public class CardOperationsGetParameters {
    /**
     * Enable test mode
     * */
    private boolean test;
    /**
     * Whether it should be updated with new cards : if false, cards will be queried only once, from the database, if true, it starts a subscription
     * */
    private boolean notification;
    /**
     * Unique autogenerated ID to identify client and avoid re-creating a subscription in case of short network unavailability for example
     */
    private String clientId;
    /**
     * This operation will aggregate card that are either :
     *  <li>starting between <code>rangeStart</code>and <code>rangeEnd</code></li>
     *  <li>ending between <code>rangeStart</code>and <code>rangeEnd</code></li>
     *  <li>starting before <code>rangeStart</code> and ending after <code>rangeEnd</code></li>
     *  <li>starting before <code>rangeStart</code> and never ending</li>
     */
    private Instant rangeStart;
    private Instant rangeEnd;
    /**
     * Filter only cards for which this user is a recipient
     * */
    private User user;

    /**
     * List of cards that should not be loaded
     */
    @Singular
    private List<String> loadedCards;

}
