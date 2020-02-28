package org.lfenergy.operatorfabric.webui.controllers;

import com.google.common.io.ByteStreams;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Controller
@Slf4j
public class SoundController {

    @Value("${operatorfabric.sounds.storage.path}")
    private String storagePath;

    @RequestMapping(value="/sounds/{severity}",
                    method = RequestMethod.GET,
                    produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public @ResponseBody byte[] getSoundOfSeverity(@PathVariable("severity") String severity) throws IOException {

        String resourcePath = storagePath +
                            File.separator +
                            severity + ".ogg";

        log.info("loading resource: " + resourcePath);

        FileInputStream fin = new FileInputStream(resourcePath);
        return ByteStreams.toByteArray(fin);
    }

}