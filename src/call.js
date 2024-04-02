openCallScreen = function () {
    const baseURl = 'meet.melpapp.com';
    /**
     * Set parameters and desired setting for jitsi call frame
     */
    let options = {
        roomName: 'e7eb765809c7066e166d793b0576bb6e',
        parentNode: document.querySelector("#callFrame"),
        jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJtZWxwX2NvbmYiLCJzdWIiOiJtZWV0ZGV2Lm1lbHAudXMiLCJtb2RlcmF0b3IiOnRydWUsImlzcyI6Im1lbHBfY29uZl84IiwiY29udGV4dCI6eyJjYWxsZWUiOnsibmFtZSI6IiIsImlkIjoiOTI0YXptbWEiLCJhdmF0YXIiOiIiLCJlbWFpbCI6IiJ9LCJ1c2VyIjp7Im5hbWUiOiJMYWtzaGF5IEFyb3JhIiwiaWQiOiI5MjRhem1tYSIsImF2YXRhciI6Imh0dHBzOi8vY2RubWVkaWEtZm0ubWVscGFwcC5jb20vTWVscEFwcC91cGxvYWRzL2RlZmF1bHRGLmpwZz9zZXNzaW9uaWQ9OWFraWxmcTBwcmxzJmlzdGh1bWI9MSIsImVtYWlsIjoiOTI0YXptbWFAbWVscC5jb20ifSwiZ3JvdXAiOiJvbmV0b29uZSJ9LCJpYXQiOjE3MTIwNzQyNzUsInJvb20iOiJlN2ViNzY1ODA5YzcwNjZlMTY2ZDc5M2IwNTc2YmI2ZSIsInJvb21OYW1lIjoiTGFrc2hheSBBcm9yYSIsImV4cCI6MTcxMjExNzQ3NX0.hsOmUaEyAIgjbjZ1p147KOelBUqLxy9tUMBZEnQwIFQ',
        userInfo: {
            email: '15526206@gmail.com',
        },
        interfaceConfigOverwrite: {
            SHOW_BRAND_WATERMARK: false,
            SHOW_JITSI_WATERMARK: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
            /* TOOLBAR_BUTTONS: ["hangup", "microphone", "camera", "desktop", "fullscreen", "videoquality", "mute-everyone", "tileview", "whiteboard", "recording", "etherpad", "videobackgroundblur", "select-background", "mute-video-everyone", "sharedvideo", "raisehand", "shortcuts", "help", "livestreaming", "shareaudio", "filmstrip", "settings"], */
        },
    };

    // if (!callInst.utilityObj.isEmptyField(callObj, 2)) {
    // $("#inCallConvId").val(callObj.incallconversationid);
    options.subject = 'abc';
    options.groupType = 6;
    options.configOverwrite = {
        startWithVideoMuted: "a",
    };

    /**
     * Call Jitsi Call object to open a call screen
     */
    melpCallInst = new JitsiMeetExternalAPI(baseURl, options);
    // window.externalCallApi = melpCallInst;
    console.log(`Melp call instance --> ${JSON.stringify(melpCallInst)}`)
    console.log(`options --> ${JSON.stringify(options)}`)
    window.globalFunction(melpCallInst, options);
    melpCallInst.on("_requestDesktopSources", async (request, callback) => {
        const { options } = request;
        console.log(`options in the request desktop sources ----> ${options}`)

        window.jitsiAPI.getDesktopSources(options)
            .then(sources => callback({ sources }))
            .catch((error) => callback({ error }));
    });



    setTimeout(() => {
        $("body").css('overflow', 'hidden');
    }, 2500);
};