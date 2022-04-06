[![Electron.NET Logo](https://github.com/ElectronNET/Electron.NET/blob/master/assets/images/electron.net-logo.png)](https://github.com/ElectronNET/Electron.NET)

[![donate](https://img.shields.io/badge/Donate-Donorbox-green.svg)](https://donorbox.org/electron-net)


AppVeyor (Win/Linux): [![Build status](https://ci.appveyor.com/api/projects/status/q95h4xt14papwi05/branch/master?svg=true)](https://ci.appveyor.com/project/robertmuehsig/electron-net/branch/master)

* Checkout AppVeyor Artifacts: Contains the WebApp sample built for Windows & Linux!

Travis-CI (Win/macOS/Linux): [![Build Status](https://travis-ci.org/ElectronNET/Electron.NET.svg?branch=master)](https://travis-ci.org/ElectronNET/Electron.NET)

Build cross platform desktop apps with .NET 5 and ASP.NET NET Core (Razor Pages, MVC), Blazor. 

Electron.NET is a __wrapper__ around a "normal" Electron application with an embedded ASP.NET Core application. Via our Electron.NET IPC bridge we can invoke Electron APIs from .NET.

The CLI extensions hosts our toolset to build and start Electron.NET applications.

## Wait - you host a .NET Core app inside Electron? Why?

Well... there are lots of different approaches how to get a X-plat desktop app running. We thought it would be nice for .NET devs to use the ASP.NET Core environment and just embed it inside a pretty robust X-plat enviroment called Electron. Porting Electron to .NET is not a goal of this project, at least we don't have any clue how to do it. We just combine ASP.NET Core & Electron. 

## 📦 NuGet:

* API [![NuGet](https://img.shields.io/nuget/v/ElectronNET.API.svg?style=flat-square)](https://www.nuget.org/packages/ElectronNET.API/) 
* CLI [![NuGet](https://img.shields.io/nuget/v/ElectronNET.CLI.svg?style=flat-square)](https://www.nuget.org/packages/ElectronNET.CLI/)

## 🛠 Requirements to run:

The current Electron.NET CLI builds Windows/macOS/Linux binaries. Our API multi-targets .NET 5 & .NET6, so our minimum base OS is the same as [.NET 5](https://github.com/dotnet/core/blob/master/release-notes/5.0/5.0-supported-os.md) or [.NET 6](https://github.com/dotnet/core/blob/main/release-notes/6.0/supported-os.md).

Also you should have installed:

* npm [contained in nodejs](https://nodejs.org)

## 💬 Community

[![Gitter](https://badges.gitter.im/ElectronNET/community.svg)](https://gitter.im/ElectronNET/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## 🙏 Donate

We do this open source work in our free time. If you'd like us to invest more time on it, please [donate](https://donorbox.org/electron-net). Donation can be used to increase some issue priority. Thank you!

[![donate](https://img.shields.io/badge/Donate-Donorbox-green.svg)](https://donorbox.org/electron-net)

## 👩‍🏫 Usage

To activate and communicate with the "native" (sort of native...) Electron API include the [ElectronNET.API NuGet package](https://www.nuget.org/packages/ElectronNET.API/) in your ASP.NET Core app.

````
PM> Install-Package ElectronNET.API
````
### Program.cs

You start Electron.NET up with an `UseElectron` WebHostBuilder-Extension. 

```csharp
public static IHostBuilder CreateHostBuilder(string[] args) =>
    Host.CreateDefaultBuilder(args)
        .ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseElectron(args);
            webBuilder.UseStartup<Startup>();
        });
```

### Startup.cs

Open the Electron Window in the Startup.cs file: 

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    ...

    // Open the Electron-Window here
    Task.Run(async () => await Electron.WindowManager.CreateWindowAsync());
}
```

## 🚀 Start the Application

To start the application make sure you have installed the "[ElectronNET.CLI](https://www.nuget.org/packages/ElectronNET.CLI/)" packages as global tool:

```
dotnet tool install ElectronNET.CLI -g
```

At the first time, you need an Electron.NET project initialization. Type the following command in your ASP.NET Core folder:

```
electronize init
```

* Now a electronnet.manifest.json should appear in your ASP.NET Core project
* Now run the following:

```
electronize start
```

### Note
> Only the first electronize start is slow. The next will go on faster.

## 🔭 Develop Electron.NET apps using a file watcher

The file watcher is included with version 8.31.1 of Electron.NET. For example, a file change can trigger compilation, test execution, or deployment. The Electron.NET window will automatically refresh and new code changes will be visible more quickly. The following Electron.NET CLI command is required:

```
electronize start /watch
```

### Note
> Only the first electronize start is slow. The next will go on faster.

## 🐞 Debug

Start your Electron.NET application with the Electron.NET CLI command. In Visual Studio attach to your running application instance. Go in the __Debug__ Menu and click on __Attach to Process...__. Sort by your projectname on the right and select it on the list.


## 📔 Usage of the Electron-API

A complete documentation will follow. Until then take a look in the source code of the sample application:  
[Electron.NET API Demos](https://github.com/ElectronNET/electron.net-api-demos)  

In this YouTube video, we show you how you can create a new project, use the Electron.NET API, debug a application and build an executable desktop app for Windows: [Electron.NET - Getting Started](https://www.youtube.com/watch?v=nuM6AojRFHk)  
  
## ⛏ Build

Here you need the Electron.NET CLI as well. Type the following command in your ASP.NET Core folder:

```
electronize build /target win
```

There are additional platforms available:

```
electronize build /target win
electronize build /target osx
electronize build /target osx-arm64
electronize build /target linux
```

Those four "default" targets will produce packages for those platforms.

Note that the `osx-arm64` build requires that the project target `net6.0`. `osx-arm64` is for Apple Silicon Macs.

For certain NuGet packages or certain scenarios you may want to build a pure x86 application. To support those things you can define the desired [.NET Core runtime](https://docs.microsoft.com/en-us/dotnet/core/rid-catalog), the [electron platform](https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#platform) and [electron architecture](https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#arch) like this:

```
electronize build /target custom "win7-x86;win32" /electron-arch ia32 
```

The end result should be an electron app under your __/bin/desktop__ folder.

### Note
> macOS builds can't be created on Windows machines because they require symlinks that aren't supported on Windows (per [this Electron issue](https://github.com/electron-userland/electron-packager/issues/71)). macOS builds can be produced on either Linux or macOS machines.

## 👨‍💻 Authors

* **Gregor Biswanger** - (Microsoft MVP, Intel Black Belt and Intel Software Innovator) is a freelance lecturer, consultant, trainer, author and speaker. He is a consultant for large and medium-sized companies, organizations and agencies for software architecture, web- and cross-platform development. You can find Gregor often on the road attending or speaking at international conferences. - [Cross-Platform-Blog](http://www.cross-platform-blog.com) - Twitter [@BFreakout](https://www.twitter.com/BFreakout)  
* **Robert Muehsig** - Software Developer - from Dresden, Germany, now living & working in Switzerland. Microsoft MVP & Web Geek. - [codeinside Blog](https://blog.codeinside.eu) - Twitter [@robert0muehsig](https://twitter.com/robert0muehsig)  
  
See also the list of [contributors](https://github.com/ElectronNET/Electron.NET/graphs/contributors) who participated in this project.
  
  
## 🙋‍♀️🙋‍♂ Contributing
Feel free to submit a pull request if you find any bugs (to see a list of active issues, visit the [Issues section](https://github.com/ElectronNET/Electron.NET/issues).
Please make sure all commits are properly documented.

## 🧪 Working with this Repo

This video provides an introduction to development for Electron.NET: [Electron.NET - Contributing Getting Started](https://youtu.be/Po-saU_Z6Ws)  
  
This repository consists of the main parts (API & CLI) and it's own "playground" ASP.NET Core application. Both main parts produce local NuGet packages, that are versioned with 99.0.0. The first thing you will need is to run one of the buildAll scripts (.cmd for Windows, the other for macOS/Linux).

If you look for pure __[demo projects](https://github.com/ElectronNET)__ checkout the other repositories. 

The problem working with this repository is, that NuGet has a pretty aggressive cache, see [here for further information](https://github.com/ElectronNET/Electron.NET/wiki).

## 🙏 Donate

We do this open source work in our free time. If you'd like us to invest more time on it, please [donate](https://donorbox.org/electron-net). Donation can be used to increase some issue priority. Thank you!

[![donate](https://img.shields.io/badge/Donate-Donorbox-green.svg)](https://donorbox.org/electron-net)

## 🎉 License
MIT-licensed

**Enjoy!**

## 📝 Important notes

### ElectronNET.API & ElectronNET.CLI Version 13.5.1

Make sure you also have the new Electron.NET API & CLI 13.5.1 version.

```
dotnet tool update ElectronNET.CLI -g
```

 This now uses [electron-builder](https://www.electron.build/configuration/configuration) and the necessary configuration to build is made in the **electron.manifest.json** file (on the build part). In addition, own Electron.NET configurations are stored (on the root). Please make sure that your **electron.manifest.json** file has the following new structure:

```
{
  "executable": "{{executable}}",
  "splashscreen": {
    "imageFile": ""
  },
  "name": "{{executable}}",
  "author": "",
  "singleInstance": false,
  "build": {
    "appId": "com.{{executable}}.app",
    "productName": "{{executable}}",
    "copyright": "Copyright © 2020",
    "buildVersion": "1.0.0",
    "compression": "maximum",
    "directories": {
      "output": "../../../bin/Desktop"
    },
    "extraResources": [
      {
        "from": "./bin",
        "to": "bin",
        "filter": ["**/*"]
      }
    ],
    "files": [
      {
        "from": "./ElectronHostHook/node_modules",
        "to": "ElectronHostHook/node_modules",
        "filter": ["**/*"]
      },
      "**/*"
    ]
  }
}
```

### ElectronNET.CLI Version 0.0.9

In the Version 0.0.9 the CLI was not a global tool and needed to be registred like this in the .csproj:

```
<ItemGroup>
     <DotNetCliToolReference Include="ElectronNET.CLI" Version="0.0.9" />
</ItemGroup>
```

After you edited the .csproj-file, you need to restore your NuGet packages within your Project. Run the following command in your ASP.NET Core folder:

```
dotnet restore
```


If you still use this version you will need to invoke it like this:

```
electronize ...
```

### Node Integration
Electron.NET requires Node Integration to be enabled for IPC to function.  If you are not using the IPC functionality you can disable Node Integration like so:

```csharp
WebPreferences wp = new WebPreferences();
wp.NodeIntegration = false;
BrowserWindowOptions browserWindowOptions = new BrowserWindowOptions
{
    WebPreferences = wp
}

```

### Dependency Injection

ElectronNET.Api can be added to your DI container within the Startup class. All of the modules available in Electron will be added as Singletons.

```csharp
using ElectronNET.API;

public void ConfigureServices(IServiceCollection services)
{
    services.AddElectron()
}
```
