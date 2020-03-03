package org.lfenergy.operatorfabric.webui.controllers;

import com.google.common.io.ByteStreams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import org.lfenergy.operatorfabric.springtools.error.model.ApiError;
import org.lfenergy.operatorfabric.springtools.error.model.ApiErrorException;

import java.io.FileNotFoundException;
import java.io.IOException;

@RestController
@Slf4j
public class SoundController {

    @Value("${operatorfabric.external-assets.sounds.path}")
    private String storagePath;

    @Value("${operatorfabric.external-assets.sounds.alarm}")
    private String alarmFile;

    @Value("${operatorfabric.external-assets.sounds.action}")
    private String actionFile;

    @RequestMapping(value="/external-assets/sounds/{severity}",
                    method = RequestMethod.GET,
                    produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public @ResponseBody byte[] getSoundOfSeverity(@PathVariable("severity") String severity) throws IOException {

        String resourcePath = storagePath +
                              File.separator;

        if (severity.equals("alarm"))
            resourcePath += alarmFile;
        else if (severity.equals("action"))
            resourcePath += actionFile;

        try (FileInputStream fin = new FileInputStream(resourcePath)) {

            log.info("loading resource: " + resourcePath);
            return ByteStreams.toByteArray(fin);
        } catch (FileNotFoundException e) {

            String message = "No sound resource exist for severity " + severity;
            log.error(message);
            throw new ApiErrorException(
                    ApiError.builder()
                            .status(HttpStatus.NOT_FOUND)
                            .message(message)
                            .build(),
                            message);
        }
    }
}