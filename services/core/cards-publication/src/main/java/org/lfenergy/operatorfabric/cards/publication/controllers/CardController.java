/* Copyright (c) 2020, RTE (http://www.rte-france.com)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


package org.lfenergy.operatorfabric.cards.publication.controllers;

import org.lfenergy.operatorfabric.cards.publication.model.CardCreationReportData;
import org.lfenergy.operatorfabric.cards.publication.model.CardPublicationData;
import org.lfenergy.operatorfabric.cards.publication.services.CardProcessingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import javax.validation.Valid;

/**
 * Synchronous controller
 *
 */
@RestController
@RequestMapping("/cards")

public class CardController {

    @Autowired
    private CardProcessingService cardProcessingService;

    /**
     * POST cards to create/update new cards
     * @param cards cards to create publisher
     * @return contains number of cards created and optional message
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public @Valid Mono<CardCreationReportData> createCards(@Valid @RequestBody Flux<CardPublicationData> cards){
        return cardProcessingService.processCards(cards);

    }

    @DeleteMapping("/{processId}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteCards(@PathVariable String processId){
        cardProcessingService.deleteCard(processId);
    }
}
