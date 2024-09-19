<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">mandoline</h3>

  <p align="center">
    A sample cutting webapp
    <br />
    <br />
    <a href="https://benbaja.github.io/mandoline/">View Demo</a>
    ·
    <a href="https://github.com/benbaja/mandoline/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/benbaja/mandoline/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This project was made for music producers in mind, especially electronic music composers.

I wanted to create a tool to quickly isolate sound from online media or recorded audio, without the hassle of opening a DAW and leaving unwanted raw files on my hard drive.

The project was named after both the [musical instrument](https://en.wikipedia.org/wiki/Mandolin) and the [cooking ustensil](https://en.wikipedia.org/wiki/Mandoline)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

Install npm if not already on your system

Download the files and run :
* npm
  ```sh
  npm run build
  ```

Then open `dist/index.html`

### Deployment
Coming soon

<!-- USAGE EXAMPLES -->
## Usage

Select from different audio sources (microphone, local file, or online media) and double click on the waveform browser to start creating a "slice", then click one last time to select the end of the slice.

A slice is a non-destructive cut of the original audio, that can be modified on the waveform browser. Use the slices list on the bottom left to rename, delete or download the slices

Slices are exported at 16bits .wav audio file

### Downloading online media

mandoline uses the [Cobalt API](https://github.com/imputnet/cobalt/blob/main/docs/api.md) for online media download. See the list of supported services [here](https://github.com/imputnet/cobalt/).

### Microphone recording

Microphone source can be selected in the settings panel


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] UX redesign
    - [ ] Custom buttons
    - [ ] Zoom from the minimap
- [ ] BPM grid
    - [ ] Parameters for BPM grid offset
- [ ] Complete CI/CD pipeline
    - [ ] E2E testing with Cypress
- [ ] Splitting with Demucs

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Wavesurfer](https://wavesurfer.xyz/) for everything waveform related, and more
* [Cobalt](https://github.com/imputnet/cobalt/) for media download

<p align="right">(<a href="#readme-top">back to top</a>)</p>