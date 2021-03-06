/* Copyright (c) 2020, RTE (http://www.rte-france.com)
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


package org.lfenergy.operatorfabric.cards.publication.model;

import lombok.*;
import org.lfenergy.operatorfabric.cards.model.RecipientEnum;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * <p>Please use builder to instantiate</p>
 *
 * <p>Recipient Model, documented at {@link Recipient}</p>
 *
 * {@inheritDoc}
 *
 *
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecipientPublicationData implements Recipient {
    @NotNull
    private RecipientEnum type;
    private String identity;
    @Singular
    private List<? extends Recipient> recipients;

    public static RecipientPublicationData union(Recipient... recipients) {
        RecipientPublicationData.RecipientPublicationDataBuilder result = RecipientPublicationData.builder()
           .type(RecipientEnum.UNION);
        for(Recipient r : recipients)
            result.recipient(r);
        return result.build();
    }

    public static RecipientPublicationData matchGroup(String group) {
        return RecipientPublicationData.builder()
           .type(RecipientEnum.GROUP)
           .identity(group)
           .build();
    }

    public static RecipientPublicationData matchUser(String user) {
        return RecipientPublicationData.builder()
           .type(RecipientEnum.USER)
           .identity(user)
           .build();
    }
}
