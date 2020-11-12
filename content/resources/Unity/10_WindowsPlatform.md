---
title: Windows Platform
image: 
description: Using the Windows platform with the Unity Toolkit.
keywords: babylon.js, exporter, unity, extension, windows platform 
further-reading:
video-overview:
video-content:
---

Windows 10 introduced the Universal Windows Platform (**UWP**), which provides a common app platform on every device that runs Windows 10. The **UWP** core APIs are the same on all Windows devices. If your app only uses the core APIs, it will run on any Windows 10 device no matter whether you are targeting a desktop PC, Xbox, Mixed-reality headset, and so on. Please refer to the [Universal Windows Platform](https://docs.microsoft.com/en-us/windows/uwp/index) documentation for details.


## Hosted Web Applications

**Progressive Web Apps** are simply web apps that are progressively enhanced with native **UWP** features on supporting platforms and browser engines, such as launch-from-homescreen installation, offline support, and push notifications. On Windows 10 with the Microsoft Edge (EdgeHTML) engine, PWAs enjoy the added advantage of running independently of the browser window as Universal Windows Platform apps. Please refer to the [Progressive Web Apps](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps/windows-features) documentation for details.

**Development Release Builds**

You must use your toolkit address or hostname as the application start page. Example: **http://192.168.0.250:8888**

**Production Release Builds**

You must use your production hostname as the application start page. Example: **https://www.myserver.com/game**


## Windows Runtime Library

When you write a Universal Windows Platform (**UWP**) app, you can use **Windows Runtime Library** classes, methods, and properties in much the same way that you would use native JavaScript objects, methods, and properties. Please refer to the [JavaScript Windows Runtime](https://docs.microsoft.com/en-us/scripting/jswinrt/using-the-windows-runtime-in-javascript) documentation for details.


## Managed Xbox Live Services

The toolkit's [Xbox Live Plugin](https://www.nuget.org/packages/BabylonToolkit.XboxLive/) provides built-in access to the **Microsoft.Xbox.Services** runtime for your game projects. Simply install the plugin into your hosted **UWP** application with the **NuGet Package Manager** command:

    Install-Package BabylonToolkit.XboxLive

The toolkit scene manager provides easy to use helper functions for Xbox Live context management:

    declare module BABYLON {
        class SceneManager {
            
            /** Are unversial windows platform services available. */
            static IsWindows(): boolean;

            /** Are xbox one platform services available. */
            static IsXboxOne(): boolean;

            /** Are xbox live platform services available. */
            static IsXboxLive(): boolean;

            /** Are xbox live platform services available and user enabled. */
            static IsXboxLivePluginEnabled(): boolean;
            
            /** Is xbox live user signed in if platform services enabled. */
            static IsXboxLiveUserSignedIn(systemUser?: Windows.System.User, player?: BABYLON.PlayerNumber): boolean;
            
            /** Validated sign in xbox live user if platform services available. */
            static XboxLiveUserSignIn(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.System.SignInResult) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): void;
            
            /** Silent sign in xbox live user if platform services available. */
            static XboxLiveUserSilentSignIn(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.System.SignInResult) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): Windows.Foundation.Projections.Promise<void>;
            
            /** Dialog sign in xbox live user if platform services available. */
            static XboxLiveUserDialogSignIn(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.System.SignInResult) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): Windows.Foundation.Projections.Promise<void>;
            
            /** Loads a xbox live user profile if platform services available. */
            static LoadXboxLiveUserProfile(player?: BABYLON.PlayerNumber, oncomplete?: (result: Microsoft.Xbox.Services.Social.XboxUserProfile) => void, onerror?: (error: any) => void, onprogress?: (progress: any) => void): Windows.Foundation.Projections.Promise<void>;
            
            /** Get xbox live user if platform services available. */
            static GetXboxLiveUser(player?: BABYLON.PlayerNumber): Microsoft.Xbox.Services.System.XboxLiveUser;
            
            /** Get xbox live user if platform services available. */
            static GetXboxLiveSystemUser(systemUser: Windows.System.User, player?: BABYLON.PlayerNumber): Microsoft.Xbox.Services.System.XboxLiveUser;
            
            /** Get xbox live user context if platform services available. */
            static GetXboxLiveUserContext(player?: BABYLON.PlayerNumber): Microsoft.Xbox.Services.XboxLiveContext;
            
            /** Resets xbox live user context if platform services available. */
            static ResetXboxLiveUserContext(player?: BABYLON.PlayerNumber): void;
            
            /** Get xbox live context property if platform services available. */
            static GetXboxLiveContextProperty(name: any): any;
            
            /** Get xbox live context property if platform services available. */
            static SetXboxLiveContextProperty(name: any, property: any): void;
            
            /** Resets xbox live property context bag if platform services available. */
            static ResetXboxLivePropertyContexts(): void;
            
            /** Sets the Xbox User Sign Out Complete Handler */
            static SetXboxLiveSignOutHandler(handler?: (result: Microsoft.Xbox.Services.System.SignOutCompletedEventArgs) => void): void;
        }
    }

Example **Xbox Live Authentication** script component:

    module PROJECT {
        export class TestSceneController extends BABYLON.MeshComponent {
            public constructor(owner: BABYLON.AbstractMesh, scene: BABYLON.Scene, tick: boolean = true, propertyBag: any = {}) {
                super(owner, scene, tick, propertyBag);
            }
            protected onSignInButton() :void {
                if (BABYLON.SceneManager.IsXboxLivePluginEnabled()) {
                    var player:BABYLON.PlayerNumber.One = BABYLON.PlayerNumber.One;
                    if (!BABYLON.SceneManager.IsXboxLiveUserSignedIn(null, player)) {

                        BABYLON.SceneManager.XboxLiveUserSignIn(player, (result: Microsoft.Xbox.Services.System.SignInResult) => {
                            var user = BABYLON.SceneManager.GetXboxLiveUser(player);
                            var msg = "(" + user.xboxUserId + ") - " + user.gamertag;
                            BABYLON.SceneManager.Alert(msg, "Xbox Live User Signed In");
                        }, (err)=>{
                            console.log(err);
                            var msg:string = "Encountered Sign Error";
                            BABYLON.Tools.Warn(msg);
                            BABYLON.SceneManager.Alert(msg, "Xbox Live Warning");
                        });

                    } else {
                        BABYLON.Tools.Warn("Xbox Live User Already Signed In");
                        BABYLON.SceneManager.Alert("User Already Signed In", "Xbox Live Warning");
                    } 
                }
            }
        }
    }

.