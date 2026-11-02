# Drawer image sources

These third-party images are not covered by the website code's MIT license.
Attribution, public availability, and an official upload do not grant republication
rights. Public-domain tags below are source claims with jurisdictional limits,
not worldwide clearance. Unverified permissions must be reviewed before release.

## Format and dates

- WebP, 512px high, quality 85, Sharp effort 6; original aspect ratios retained.
- No additional cropping, recoloring, or restoration unless noted. Earlier source
  crops and restorations remain part of the selected version.
- Originals are preserved separately; derivatives omit embedded metadata.
  Enlarged low-resolution sources are identified below; enlargement adds no detail.
- Filenames are `<year>-<hash>.webp`, using the first eight lowercase characters
  of the final file's SHA-256 digest. Changed bytes require a new hash, filename,
  gallery record, and explicit asset allowlist entry.
- Years describe the event, exposure, document, artifact, or publication specified
  below, not a later scan, upload, restoration, or reproduction photograph.
  A representative year does not establish an exact exposure date.
- Gallery metadata is in `lib/drawer-data.ts`. Newest years come first; source-array
  order breaks ties within a year.

## Image loading

Static HTML eagerly loads the first three images so the leading group does not
wait for hydration. Once hydrated, the justified layout and the available height
below the header determine which additional images intersect the initial viewport;
all of those images load eagerly, including a partially visible last row. The
first three remain eager as a bounded fallback, even on a very short screen.
Other images retain native lazy loading. Resizing updates the initial viewport
calculation, but scrolling does not promote the rest of the gallery to eager.
No image preloads or blanket high fetch priorities are added. Without JavaScript,
the same initial group and browser-native lazy loading remain functional.

## Sources and rights

- `1837-92ed0aed.webp`: Darwin's “I think” tree sketch, Notebook B, DAR 121,
  page 36. The notebook spans 1837–1838; no exact sketch date is assigned.
  Cambridge University Library requests permission for public-web reproduction.
  Its CC BY-NC-ND 3.0 statement covers metadata, not the image. Permission unverified.
  [Source](https://www.darwinproject.ac.uk/commentary/evolution/darwin-s-species-notebooks-i-think).
  [Library record](https://cudl.lib.cam.ac.uk/view/MS-DAR-00121/38).
- `1878-13c1acd5.webp`: Edison with an early phonograph, attributed to Levin C.
  Handy; Library of Congress `cwpbh.04044`. Commons records circa 1877 and suggests
  18 April 1878 from a similar portrait. The requested display year is 1878;
  the internal title retains 1877–1878. Exact date and primary catalogue unverified.
  Commons marks the reproduction public domain.
  [Source](https://commons.wikimedia.org/wiki/File:Edison_and_phonograph_edit1.jpg).
  [Catalogue identifier](https://hdl.loc.gov/loc.pnp/cwpbh.04044).
- `1888-3d605253.webp`: Isaac Roberts's Andromeda exposure of 29 December 1888,
  reproduced as an 1891 lithograph. The year dates the observation, not the print.
  Commons: `PD-old-100-expired`.
  [Source](<https://commons.wikimedia.org/wiki/File:Andromeda_Nebula_-_Isaac_Roberts,_29_December_1888_(cropped).jpg>).
- `1888-2ce12d1f.webp`: monochrome engraving by an unknown artist, published in
  Camille Flammarion's _L’Atmosphère_ (1888), page 163. Flammarion is the author,
  not the asserted engraver. Commons: `PD-Art` / `PD-old-100`; not a later colorization.
  [Source](https://commons.wikimedia.org/wiki/File:Flammarion.jpg).
- `1895-0f1be4a4.webp`: hand radiograph attributed to W. K. Röntgen, dated 1895.
  Identification as his wife's hand, and the associated 22 December date, remain
  uncertain. Credit: W. K. Röntgen / Wellcome Collection, licensed under
  [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/), requiring
  attribution and noncommercial use.
  [Source](https://wellcomecollection.org/works/wjc8ejn2).
- `1903-d87a9206.webp`: the Wright Flyer's first flight, 17 December 1903;
  John T. Daniels, restored by Wright Stuf in 2018. Orville is aboard and Wilbur
  runs alongside. Commons: `PD-1923`. Not the retired, undated flight-film frame.
  [Source](<https://commons.wikimedia.org/wiki/File:Wright_First_Flight_1903Dec17_(full_restore_115).jpg>).
- `1911-08aae1c3.webp`: Amundsen's expedition at the South Pole, December 1911;
  Olav Bjaaland. Wikipedia identifies the reproduction as the plate facing page
  134 of _The South Pole_, volume II, in a 1913 edition. Its qualified `PD-US`
  claim does not establish worldwide clearance; the file warns against transfer
  to Commons before 1 January 2032 because of source-country protection.
  [Source and rights notice](https://en.wikipedia.org/wiki/File:At_the_South_Pole,_December_1911.jpg).
- `1923-a01725f5.webp`: Hubble's plate H335H, exposed on 5–6 October 1923;
  the “VAR!” annotation came later. Credit: Carnegie Science. Noncommercial
  private, research, and educational use is allowed, but publication, exhibition,
  and distribution require permission. Website and repository permission unverified.
  [Source and terms](https://carnegiescience.edu/about/history/archives/plate-archives/m31var).
  [Permission form](https://carnegiescience.widen.net/s/ktx2kpjnct/carnegierequestforpermissionsform).
- `1926-0b2c1295.webp`: Goddard with a liquid-fueled rocket; Esther C. Goddard,
  NASA GPN-2002-000132. Commons dates the exposure to 8 March 1926, citing the
  National Air and Space Museum, not the first flight on 16 March.
  Commons: `PD-US-expired`; NASA hosting does not establish government authorship.
  [Source](https://commons.wikimedia.org/wiki/File:Goddard_and_Rocket.jpg).
- `1927-49c03a62.webp`: fifth Solvay Conference; Benjamin Couprie. Commons'
  public-domain claim is disputed for France and Belgium; worldwide status unverified.
  [Source](https://commons.wikimedia.org/wiki/File:Solvay_conference_1927.jpg).
  [Copyright discussion](https://commons.wikimedia.org/wiki/Commons:Deletion_requests/Files_in_Category:Benjamin_Couprie).
- `1939-b21dc2da.webp`: both pages of the letter dated 2 August 1939, largely
  written by Leó Szilárd and signed by Einstein. Credit: FDR Presidential Library
  & Museum. Commons cites publication in the 1945 Smyth Report without notice
  (`PD-US-no notice`), not government authorship or worldwide public-domain status.
  This replaces the retired 1946 reenactment photograph.
  [Source](https://commons.wikimedia.org/wiki/File:Einstein-Roosevelt-letter.png).
- `1944-15bd6f39.webp`: Colossus Mark II operators; The National Archives (UK).
  The requested display year is 1944; the museum catalogue dates the photograph
  1944–1945. Commons' 1943 attribution conflicts with Mark II's June 1944 debut.
  A single exposure year remains unconfirmed. Commons marks the reproduction `PD-UKGov`.
  [Gallery source](https://artsandculture.google.com/asset/colossus-in-1944-5-the-national-archives-uk/2QHDbwwyEmwlYw).
  [Downloaded reproduction](https://commons.wikimedia.org/wiki/File:Colossus.jpg).
  [Broader catalogue range](https://artsandculture.google.com/asset/colossus-10/RgEMNv8jzlAFEA).
  [Mark II chronology](https://www.tnmoc.org/rebuilding-colossus).
- `1945-c6d458d7.webp`: Trinity, 16 July 1945, from colorized footage in
  _Trinity and Beyond_. Commons credits the U.S. DOE and applies `PD-USGov-DOE`;
  rights in the later colorization remain unverified.
  [Source](https://commons.wikimedia.org/wiki/File:Trinity_Detonation_T%26B.jpg).
- `1947-3f7b6948.webp`: the Harvard Mark II moth log, dated 9 September 1947,
  not an erroneous 1945 archival caption or a 1988 courtesy credit. Commons
  identifies an official U.S. Navy work: `PD-USGov-Military-Navy`.
  [Source](https://commons.wikimedia.org/wiki/File:First_Computer_Bug,_1947.jpg).
- `1952-d3a42890.webp`: Shannon's Theseus demonstration. MIT Technology Review
  and ZKM date the film to 1952, not the machine's 1950 construction. Uploaded
  by Allen Riley from AT&T material; frame reuse unverified. Enlarged from 550 × 310.
  [Source](https://www.youtube.com/watch?v=_9_AEVQ_p74).
  [Date reference](https://www.technologyreview.com/2018/12/19/138508/mighty-mouse/).
  [Film catalogue](https://zkm.de/en/artwork/theseus-mouse-with-a-memory).
- `1952-0eddee41.webp`: Oppenheimer and von Neumann at the IAS computer's
  October 1952 dedication, not the file's 2010 timestamp. Photographer unknown.
  Commons' generic `PD-old` tag is insufficient to establish worldwide clearance;
  its cited Haverford reproduction was unavailable. Reuse unverified.
  [Source](https://commons.wikimedia.org/wiki/File:Oppenheimer_%26_Neumann.jpg).
- `1954-d6f1bea7.webp`: Einstein and Gödel, Princeton, 1954; Leonard McCombe,
  LIFE, © Time Inc. The catalogue permits “personal non-commercial use only,”
  which does not establish public website or repository redistribution permission.
  [Source](https://artsandculture.google.com/asset/PQEzkHiRxRwJCA?hl=en).
- `1956-e3e50b00.webp`: Dartmouth workshop; Nathaniel Rochester, provided by
  The Minsky Family. His letter of 8 November 1956 supports the date. The linked
  article identifies Peter Milner, not Trenchard More, between Solomonoff and
  Shannon. Not the 2006 reunion or the article's 2023 publication. Reuse unverified.
  [Source](https://spectrum.ieee.org/dartmouth-ai-workshop).
- `1959-3bc6d7e4.webp`: Rosenblatt and the Mark I perceptron's sensor. The post
  says “c 1959” and credits “Wiki” without identifying a photographer or license.
  The requested label is 1959; the title retains approximate dating.
  [Source](https://fiascodata.blogspot.com/2018/05/a-computer-program-is-said-tolearn-from.html).
- `1962-ce62a2e5.webp`: Dirac and Feynman at Jabłonna, Poland, during the
  General Relativity and Gravitation conference in July 1962, not the cited
  article's 2014 publication. Credit: Marek Holzman. Commons licenses the image
  under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); this resized
  WebP retains that license and attribution.
  [Source](https://commons.wikimedia.org/wiki/File:Paul_Dirac_and_Richard_Feynman_at_Jab%C5%82onna_1962.png).
  [Cited publication](https://doi.org/10.1007/s10714-014-1718-y).
- `1964-c9f2d70c.webp`: _MIT Science Reporter: Computer Sketchpad_ (1964),
  AAPB cpb-aacip_15-40xpq2xm. GBH's index supports the program year; direct AAPB
  access was unavailable. The supplied excerpt's “1963” title dates neither this
  television material nor its upload. Fuller credits identify MIT, NET, and WGBH.
  Reuse unverified. Enlarged from 424 × 240.
  [Gallery source](https://americanarchive.org/catalog/cpb-aacip_15-40xpq2xm).
  [GBH index](https://openvault.wgbh.org/search?q=Computer%20Sketchpad).
  [Supplied excerpt](https://www.youtube.com/watch?v=6orsmFndx_o).
  [Fuller copy](https://www.youtube.com/watch?v=2k5HU4MfqwA).
- `1965-f2d6dc61.webp`: Mariner 4's hand-colored artifact and data, dated
  15 July 1965, not the later photograph of the framed work. Colors encode
  numerical data, not natural surface colors. Credit: NASA/JPL-Caltech/Dan Goods.
  File-specific reuse terms unverified.
  [Source](https://science.nasa.gov/resource/first-tv-image-of-mars-hand-colored/).
- `1968-d9922dc0.webp`: Engelbart's demonstration of 9 December 1968, uploaded
  by Marcel. Reuse unverified. Enlarged from 240 × 242.
  [Source](https://www.youtube.com/watch?v=yJDv-zdhzMY).
- `1969-4f1ead2e.webp`: Hamilton beside her MIT team's Apollo software listings;
  Draper Laboratory, restored by Adam Cuerden in 2017. The year dates the original
  photograph, not the restoration. Commons: `PD-US-no notice`.
  [Source](https://commons.wikimedia.org/wiki/File:Margaret_Hamilton_-_restoration.jpg).
- `1969-52b68d20.webp`: Aldrin on the Moon, photographed by Neil Armstrong on
  20 July 1969, NASA AS11-40-5903. Commons: `PD-USGov-NASA`.
  [Source](https://commons.wikimedia.org/wiki/File:A_Man_on_the_Moon,_AS11-40-5903.jpg).
- `1969-e13ba13b.webp`: UCLA IMP log entry, 29 October 1969 at 22:30 Pacific
  Time, not the modern logbook photograph's date. DARPA supplies the image but
  does not separately establish the photograph's reuse license.
  [Source](https://www.darpa.mil/news/features/arpanet).
- `1970-f09dd652.webp`: Allen and Gates at Lakeside School; Bruce Burgess.
  Commons cites a school yearbook and the school's Bruce Burgess Photo Archive,
  applying `PD-US-no notice`. Publication formalities and worldwide status are
  unverified; the registration-required yearbook service was not accessed.
  [Source](https://commons.wikimedia.org/wiki/File:Paul_Allen_and_Bill_Gates_at_Lakeside_School_in_1970.jpg).
- `1979-fee80443.webp`: Luminet, _Image of a Spherical Black Hole with Thin
  Accretion Disk_, A&A 75, 228–235. PDF pages 7–8 (printed 234–235) are joined
  horizontally. Credit: © European Southern Observatory, via NASA ADS.
  Redistribution permission unverified.
  [Source](https://ui.adsabs.harvard.edu/abs/1979A%26A....75..228L/abstract).
  [Scan](https://articles.adsabs.harvard.edu/pdf/1979A%26A....75..228L).
- `1985-7bc2a7a6.webp`: Erdős and Tao at the University of Adelaide. Attribution:
  Billy or Grace Tao; the photographer is not narrowed to one parent. Commons
  records VRT permission. This enlarged WebP reproduction remains under
  [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/), not MIT.
  Enlarged from 515 × 348.
  [Source](https://commons.wikimedia.org/wiki/File:Paul_Erdos_with_Terence_Tao.jpg).
- `1986-cfd6240d.webp`: Feynman's C-clamp and ice-water demonstration during the
  Challenger investigation, not the launch date or the image's 2016 upload.
  Photographer and reuse permission unverified; not assumed to be a NASA work.
  Enlarged from 300 × 259.
  [Source](https://feynman.com/science/the-challenger-disaster/).
  [Photograph](https://feynman.com/wp-content/uploads/2016/01/IceDunk.jpg).
- `1989-0209c2c9.webp`: Berners-Lee's Web proposal, March 1989, with “Vague but
  exciting…”. Later redistribution in May 1990 is distinct. Reuse terms unverified.
  [Source](https://cds.cern.ch/record/1164396).
  [Proposal history](https://www.w3.org/History/1989/proposal.html).
- `1990-4a9f5f9f.webp`: Voyager 1's original PIA00452 _Pale Blue Dot_, from
  exposures on 14 February 1990; NASA/JPL. Not the 2020 revision PIA23645.
  [Source](https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/).
  [Original](https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia00/pia00452/PIA00452.jpg).
- `1991-ed14b0c9.webp`: a rendering of the opening of Linus Torvalds's
  `comp.os.minix` post, dated 25 August 1991 in the image. This is a Usenet
  announcement, not a private email or a period screenshot: Janiara1 created
  the image in 2018. Commons licenses the image under
  [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); the resized
  WebP retains that license. The uploader's license does not independently
  establish rights to Torvalds's underlying text. Enlarged from 512 × 258.
  [Source](https://commons.wikimedia.org/wiki/File:Linus_eka_email.png).
- `1993-0f4046c2.webp`: Wiles's announcement at the Isaac Newton Institute,
  23 June 1993, before the 1994 correction with Richard Taylor. Credit: Isaac
  Newton Institute, via Plus. Not the article's 2023 portrait. Photographer and
  reuse permission unverified. Enlarged from 350 × 301.
  [Source](https://plus.maths.org/very-old-problem-turns-30).
  [Photograph](https://plus.maths.org/content/sites/plus.maths.org/files/articles/2023/FLT/ANDREW%20WILES_web.jpeg).
- `1995-ae39136c.webp`: Hubble Deep Field exposures from December 1995, released
  15 January 1996. Credit: Robert Williams / NASA / ESA / STScI.
  Commons: `PD-USGov-NASA` for this file.
  [Source](https://commons.wikimedia.org/wiki/File:HubbleDeepField.800px.jpg).
- `1997-5a015f87.webp`: the 1997 Kasparov–Deep Blue rematch, from _Game Over:
  Kasparov and the Machine_ (2003), uploaded by ChessLibrary. No exact game/day
  is assigned to this frame. Film redistribution permission unverified.
  [Source](https://www.youtube.com/watch?v=gDe-uHsEMn8).
  [Event history](https://www.ibm.com/history/deep-blue).
- `2007-cba3bccf.webp`: Jobs introduces the iPhone at Macworld, 9 January 2007,
  not the June retail launch. Protectstar Inc.'s upload is not identified as an
  official Apple publication. Frame reuse unverified.
  [Source](https://www.youtube.com/watch?v=VQKMoT-6XSg).
  [Contemporaneous announcement](https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/).
- `2010-5cadc5e3.webp`: Hanyecz's two-pizza purchase for 10,000 bitcoins,
  22 May 2010. The archived gallery lists `IMG_0988.jpg` at 15:01:56 -0400,
  consistent with its EXIF date, not an independent delivery-time measurement.
  The 2021 archive date is separate. Photographer and reuse license unverified.
  [Source](https://web.archive.org/web/20211219130004/http://heliacal.net/~solar/bitcoin/pizza/).
- `2011-ac4c6eae.webp`: Watson's 2011 _Jeopardy!_ challenge, not the video's
  2013 upload. Official IBM Research footage; frame reuse unverified.
  [Source](https://www.youtube.com/watch?v=P18EdAKuC1U).
  [Event history](https://www.ibm.com/history/watson-jeopardy).
- `2016-f8900464.webp`: “AlphaGo resigns” in match 4 against Lee Sedol,
  13 March 2016 in Korea. The broadcast's 12 March U.S. date is a time-zone
  difference, not a different game. Official Google DeepMind footage; reuse unverified.
  [Source](https://www.youtube.com/watch?v=yCALyQRN3hw).
- `2022-445100c4.webp`: the exhibition photograph of _Théâtre D’opéra Spatial_
  with its “FIRST PLACE” ribbon and label, via VICE's contemporary reporting.
  The underlying work is by Jason M. Allen using Midjourney. The photograph's
  creator and reuse permission are unverified; the AI artwork's copyright status
  does not establish rights to this photograph.
  [Source](https://www.vice.com/en/article/an-ai-generated-artwork-won-first-place-at-a-state-fair-fine-arts-competition-and-artists-are-pissed/).
  [Photograph](https://www.vice.com/wp-content/uploads/sites/2/2022/08/1661956681982-screen-shot-2022-08-30-at-102800-pm.png).
- `2024-c539b3fe.webp`: Nobel Prize ceremony at Stockholm Concert Hall,
  10 December 2024; © Nobel Prize Outreach. The broadcast's existing watermarks
  are retained. Official footage does not itself license extracted frames.
  Reuse permission and the linked livestream terms remain unverified.
  [Source](https://www.youtube.com/watch?v=6-A4dUowT4Q).
  [Livestream terms](https://www.nobelprize.org/ceremony/streams-terms-of-use/).
