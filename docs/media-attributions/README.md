# Media inventory

Existing source images: `assets/images/menengai/`. Derivatives: `public/images/gallery/` and `public/images/projects/`. WebP copies use quality 84, with 720 px responsive variants for photographic assets. Originals are preserved. The web preview/social assets in `public/` predate this work. Neither source filenames nor public profile availability prove reuse permission; see BRANDING_VERIFICATION.md.

Portrait updated: the President's photograph (`wanjiku-nguru-320.webp` and `-640.webp`) was
replaced on 12 October 2026 with a newer club-supplied image (`Wanjiku.jpeg`, 960x1280) showing her
with the Rotaract presidential medal and the club's Four-Way Test banner. The 3:4 source matches the
President feature frame, so it is published uncropped; the other eleven portraits are unchanged.

Officer portraits: `public/images/leadership/*.webp` are cropped from the twelve leadership
cards the club supplied on 12 October 2026 (see BRANDING_VERIFICATION.md). They are the club’s
own photographs of its officers; no external imagery was downloaded for them.

Installation photographs: `public/images/events/installation-2026/` holds twelve photographs from
the club's Presidential Installation (6–7 June 2026), supplied by the club on 12 October 2026.
Each is published at 1280px (`NN.webp`) plus a 560px thumbnail (`NN-560.webp`) — 24 files,
~2.0 MB. The originals are 1202x1600 or 1600x1202 JPEGs; nothing is cropped beyond proportional
resizing, and no filter or recolouring is applied. The files carry no photographer credit and
none is claimed on the site; the club is responsible for the photographers' permission.

Mother pack photographs: `public/images/events/mother-pack-bondeni-2026/` holds eleven
photographs from the Mother Pack Project at Bondeni Maternity Hospital (16 July 2026), supplied by
the club on 12 October 2026 in `drive-download-20261012T110426Z-1-001`. Published at 1280px plus
560px thumbnails — 22 files, ~1.9 MB. Twelve files were supplied; **`IMG_0111.HEIC` is not
published** because no HEIC decoder is available in the build environment — re-export it as JPEG
to include it. Original EXIF (timestamps and location) is **not** carried into the published
files, because the WebP conversion drops it.

Consent note: several of these photographs show identifiable mothers and newborns in a hospital
ward. The club supplied them for publication and is responsible for patient consent and for the
hospital's own policy on photography.

Kabatini photographs: `public/images/events/mother-pack-kabatini-2026/` holds thirteen photographs
from the Mother Pack Project at Kabatini Maternity (22 August 2026, with the Rotaract Club of
Bahati), supplied on 12 October 2026 in `drive-download-20261012T111018Z-1-001`. Thirteen of the
twenty-six stills supplied are published — the rest are near-duplicate frames of the same moments.
Published at 1280px plus 560px thumbnails. The folder also contains a 157 MB `.MOV` video, which is
**not published**: no video tooling (ffmpeg) exists in this environment, and a file that size does
not belong in the repository — host it on the club's YouTube or Facebook page and link to it.

Pangani art day photographs: `public/images/events/pangani-art-day-2026/` holds eleven
photographs from the Art Day at Pangani Special School (5 September 2026), supplied on 12 October
2026 as WhatsApp images. Thirteen were supplied; eleven are published, the other two being
near-duplicate wide frames of the same hall. Published at 1280px plus 560px thumbnails.

Consent note (children): these photographs show identifiable learners at a special school. The
club supplied them for publication and is responsible for **guardian consent** and for the
school's own policy on photographing learners. The selection favours wide views, work in progress
and the learners' artwork over close portraits of individual children, but identifiable faces
remain in several frames. Publish only once that consent is confirmed.

Mazingira Day photographs: `public/images/events/mazingira-day-pangani-2026/` holds eleven
photographs from Mazingira Day at Pangani Special School (10 October 2026), supplied on
12 October 2026. Thirteen were supplied; eleven are published, the rest being near-duplicate
planting frames. Published at 1280px plus 560px thumbnails.

Mazingira Day videos: three `.mp4` clips were supplied (1.4 MB, 11.2 MB, 1.3 MB), all H.264/AAC and
therefore browser-playable. **None is published**, because this environment has no tooling to
inspect, trim, compress or poster-frame video, and publishing footage nobody has previewed is not
acceptable; the 11 MB clip is also too heavy for the repository. Host them on the club's YouTube or
Facebook page and embed, or supply compressed clips with a chosen poster frame.

Medical outreach video and stills: `public/videos/President-Wajiku-Medical-Camp.mp4` is the
club-supplied video received on 20 November 2026. It remains in its original 576x1024 portrait
orientation, with H.264/AAC audio, a 65.4-second runtime and a web-optimised fast-start container
(7.7 MB). The page uses `preload="metadata"`, native controls and a poster extracted from the
footage. Three uncropped stills in `public/images/events/medical-camp-2026/` were extracted from
the same video for the event gallery. The original downloaded file remains untouched in
`~/Downloads/President-Wajiku-Medical-Camp.mp4`. No photographer credit or transcript was supplied,
so neither is claimed.

Medical outreach photographs: twelve iPhone 14 Pro HEIC files were supplied on 25 November 2026
from `drive-download-20261125T141519Z-1-001`. Their EXIF capture dates are 18 November 2026. The
originals are 3024x4032 or 4032x3024 and remain in Downloads. Each photograph is published
uncropped as WebP at a 1280 px maximum long edge plus a 560 px thumbnail. The gallery avoids
identifying people by name, and the club remains responsible for photographer credit and consent.

Partners' report: the 22-page club-supplied PDF received on 26 November 2026 is preserved at
`public/reports/rac-menengai-free-medical-outreach-partners-report-2026.pdf`. A first-page WebP
preview is shown on the event page. The report identifies Issa Telot and Wanjiku Nguru as its
preparers. Its figures conflict with the earlier five-metric record and are not used to replace
those public figures without confirmation.

Additional partner logos received with the report are Equity Afya (`equity_logo.pdf`), Supreme
Pharmacy (`supreme logo.pdf`) and The Nairobi Women's Hospital (WhatsApp JPEG). The PDFs were
rasterised at 300 dpi, the white page margins were trimmed, and all three were normalised to WebP.
They appear in the site-wide partner wall at `/partnerships#partners`; the event page links there
instead of repeating the partner gallery.

### Naming convention

Event photographs are named `<event>-<year>-<subject>.webp` with a `-560` thumbnail suffix, e.g.
`kabatini-2026-group-with-packs.webp` and `kabatini-2026-group-with-packs-560.webp`. Subjects name
what the photograph shows, so a file can be identified without opening it. The earlier numeric
names (`01.webp`) were replaced on 12 October 2026.

### Selection discipline

Two rules, learned from mistakes made here:

1. **Match source files exactly.** Selecting by substring (`11.45.31`) silently picks
   `11.45.31 (1)` when variants exist — which published the same photograph twice under two names.
   Select by full filename.
2. **Hash the outputs.** After generating, assert that no two published files share an MD5. Near
   duplicates survive a filename check but not a hash check.

### HEIC and EXIF

Club photographs arrive as iPhone HEIC. `.HEIC` files are decoded with the `heic-convert` package
(WASM libheif), installed on demand with `npm install --no-save heic-convert` — it is deliberately
not a project dependency. Re-encoding to WebP drops **all EXIF**, so capture timestamps and
location never travel with the published files.

Fonts fetched from Google’s font CDN:
- Barlow Condensed 700: https://fonts.gstatic.com/s/barlowcondensed/v13/HTxwL3I-JCGChYJ8VI-L6OO_au7B46r2_3E.ttf
- Manrope 400: https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FO_F.ttf
- Manrope 700: https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk4aE-_F.ttf

Converted with fontTools to locally hosted WOFF2. No external font requests occur at page load. Family information and licensing: https://fonts.google.com/specimen/Barlow+Condensed and https://fonts.google.com/specimen/Manrope .
