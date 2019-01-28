package org.lfenergy.operatorfabric.springtools.config.oauth;


import feign.Request;
import feign.mock.HttpMethod;
import feign.mock.MockClient;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.lfenergy.operatorfabric.springtools.config.oauth.application.UserServiceCacheTestApplication;
import org.lfenergy.operatorfabric.users.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@SpringBootTest(classes = UserServiceCacheTestApplication.class)
public class UserServiceCacheShould {

    @Autowired
    UserServiceCache userServiceCache;

    @Autowired
    MockClient mockClient;

    @BeforeEach
    public void setup(){
        userServiceCache.clearUserCache();
        mockClient.resetRequests();
    }

    @Test
    public void objectsUnderTestAreNotNull(){
        assertThat(userServiceCache).isNotNull();
        assertThat(mockClient).isNotNull();
    }

    @Test
    public void mockClientRequestsAreResetBeforeEachTest(){
        assertThat(mockClient.verifyTimes(HttpMethod.GET, "/users/"+"jmmclane",0)).isEmpty();
    }

    @Test
    public void shouldReturnCorrectUserData(){
        String principalID ="jmcclane";
        User user = userServiceCache.fetchUserFromCacheOrProxy(principalID);
        assertThat(user).isNotNull();
        assertThat(user).isInstanceOf(User.class);
        assertThat(user.getLogin()).isEqualTo(principalID);
        log.info("User : {}",user);
        /* log.info("Groups retrieved : {}", user.getGroups().toString());
        assertThat(user.getGroups()).containsExactlyInAnyOrder("good_guys","user");*/
        assertThat(user.getFirstName()).isEqualTo("John");
        assertThat(user.getLastName()).isEqualTo("McClane");
    }

    @Test
    public void shouldNotHitCacheForFirstCall(){
        String principalID ="jmcclane";
        //First call
        userServiceCache.fetchUserFromCacheOrProxy(principalID);
        mockClient.verifyTimes(HttpMethod.GET, "/users/"+principalID, 1);
    }

    @Test
    public void shouldReturnSameDataForSecondCall(){
        String principalID ="jmcclane";

        //First call
        User user1 = userServiceCache.fetchUserFromCacheOrProxy(principalID);

        //Second call
        User user2 = userServiceCache.fetchUserFromCacheOrProxy(principalID);

        assertThat(user1).isNotNull();
        assertThat(user1).isEqualTo(user2);
    }

    @Test
    public void shouldHitCacheForSecondCall(){
        String principalID ="jmcclane";

        //First call
        userServiceCache.fetchUserFromCacheOrProxy(principalID);

        //Second call
        userServiceCache.fetchUserFromCacheOrProxy(principalID);

        List<Request> results = mockClient.verifyTimes(HttpMethod.GET, "/users/"+principalID, 1);
        //TODO Understand why the expected number of times has to be checked twice (once in verify, once in results size)
        assertThat(results).hasSize(1);
        //mockClient.verifyStatus(); //TODO find out what that's for
    }

}
