# Changelog

### Includes all commits and updates regarding What's The Weather website. Note that versions lower than 1.0.0 are development ones. 

### Starting from 1.0.0, all updates are published live: [https://wtweather.cyclic.app/](https://wtweather.cyclic.app/) 

#### ( Old version: ~~https://what-s-the-weather.herokuapp.com/~~ )

<br><hr>

**[2.0.2] Add links source inside footer**
<br>
_20.04.2023_

Footer 'extras' section receive an update, which makes links redirecting
to a desired website sources. Those are: documentation page, website
changelog, terms of use and credits page - in respective order.

<br><hr>

**[2.0.1] Minor bug solving for mobile devices**
<br>
_19.04.2023_

(No description provided)

<br><hr>

**[2.0.0] Final production update**
<br>
_19.04.2023_

**Website got moved to a new hosting provider - Cyclic - with all app recent layout and functionality updates**

<br><hr>

**[1.4.0] Code refactoring**
<br>
_18.04.2023_

This update is all about updating what has already been written.

First of all, got rid of all unnecessary / unused files by permanently
removing them from the project. What's more, remain files now take less
lines of code, because of console logs removal, and some outdated code
parts (commented out or not).

As a cherry on top, there is a new, cloud-shaped tab icon (favicon) for
the website. Apart from that, SASS got installed - in order to make it
easier to maintain already huge style files more easily for further
project updates.

<br><hr>

**[1.3.7] Finish queries for detailed weather page**
<br>
_13.04.2023_

It's finally done ! All media queries are fully prepared for the website.
Here a tablet and portrait oriented mobiles got served with a lot of
corrections, which as a result fit them appropiately to the content
that websites offer. Minor corrections are still to do (they are some
further improvements expected), however for now the app content seems
to be scaled properly.

<br><hr>

**[1.3.6] Complete design for weather detailed page**
<br>
_12.04.2023_

By now all the updates concerning layout changes are finally completed.
The most important one is handling an errors with custom error page.
Moreover, got rid of some useless code from before this year update.
Added some onload animations for detailed page, which occur whenever
page is being loaded / refreshed.

<br><hr>

**[1.3.5] Patch routing bugfixes**
<br>
_08.04.2023_

Quick bugfix regarding new routing scheme. Now routing for cities with
the same name and short named cities is enabled and will be working
absolutely fine.

<br><hr>

**[1.3.4] Update route pathing**
<br>
_08.04.2023_

Several modifications for 'behind-the-scenes' transition process in
between App page and Detailed page. Routing is now made more strict
and precise, containing requested city's country code and chosen
temperature unit. This change enable to easily query and access cities
that names are either short (e.g. Y village in France) or repetitive
(e.g. Dublin in US vs. Dublin in Ireland, where US one was dominant).
Also changed a default Wind Speed calculation unit (from m/s to km/h)
and adjusted a weather detailed graph visual bars for that change.

<br><hr>

**[1.3.3] Complete update for weather box (detail page)**
<br>
_06.04.2023_

Weather box (located at the top of Detailed page) received some fixes.
The section is now covering the whole screen, where the weather box is
centered within. The view received some mixes of box shadows, font
size and positioning adjustments, and a fancy looking decoration in
between of subsection titles for Weather box. All the flags inside got
minor saturation lowering to make the colors less bright and to
avoid distraction.

<br><hr>

**[1.3.2] Include footer to a webpage**
<br>
_02.04.2023_

This update adds a brand new footer to the very bottom of detailed
webpage. It is divided into 3 sections. First one is 'About the project',
which verbosely describes the main prupose of the app and includes the
copyright note. Second one is handling some extra important reference
links related to the app (documentation, changelog, license and credits
sections) - they currently do not redirect anywhere. Lastly, a 'follow'
section, containing 4 social media boxes, which will redirect to a given
social media account of the app author.

<br><hr>

**[1.3.1] Recreate detailed weather section**
<br>
_31.03.2023_

Another detailed webpage component received a huge, quality shift
update. This time the changes were revolving weather diagram, which
stores very precise bits of information.

The component got expanded, now storing 40 weather logs (it used to be
10 though). Overall design got comprehensively modifed, giving the
table and mild color palette, with some table size adjustments being
done. Categories held by this table also are changed. Now keeps track
of Date, Degrees (temperature), Overcast, Humidity, Pressure, Wind
categories.

This table extends its' basic role to be a generic lookup box - each
category has two action buttons (with exception of Date category, which
contain only one). One of the buttons allow to sort the array in
ascending or descending order; in fact it enables changing type of
sorting by clicking the same button repeatedly. Another one updates
the graph component, so that it displays a picked category values over
following 5 days time.

<br><hr>

**[1.3.0] Updating detailed weather page (part 1)**
<br>
_26.03.2023_

The time has come to reupload a new version of detailed weather page.
The very first step is now taken here, by adding a new weather box,
which includes all the details regarding picked city. Those are
(for instance, city coords, sunset and sunrise time, timezone, etc).
Also, a crucial changes are made for weather graph, making it more
scalable, responsive, and adding a bit of extra styling and animations.
By now, almost half of the work for detailed weather page are done.

<br><hr>

**[1.2.1] Minor improvemnts for app page**
<br>
_19.03.2023_

Most likely those are the last changes made for the app page. They are
the cherry on top of recent work around this View. Here are the
improvemnts:

1) Each weather box is now non-draggable. That means user cannot
move a linked box to a new tab. The only way is to click onto a
weather box (which prevents from crashing the app).

2) Changed hover background for "cloudy" type of weather, so that it
has more balanced, stable background.

3) Animated hover effect so that the background appears when user
keeps the mouse cursor onto a weather box. Also once cursor leaves
the weather box, fading animation is fired, causing the background
to disappear smoothly.

<br><hr>

**[1.2.0] Update app main page**
<br>
_18.03.2023_

The old, production version of this app was looking awful. In fact,
app did not received any update for nearly two years. This huge
update initiates some other follow-ups to completely redesign the
visuals for this app, and to implement layout corrections. Here are
the changes made so far:

1) Completely removed "Updated" section, which used to showcase exact
time and date of last city query by using searchbar. Instead a
temperature buttons got added. They easily allow to switch between
diferrent temperature units. Currently supported formats are:
Celcius degree (C), Fahrenheit (F), and Kelvin (K).

2) Drastically modified weather boxes for queried cities. Not only
the layout got changed, but also now weather box contains a flag,
which represents the country of which queried city belongs to.

3) Got rid of hover type of animation, when user navigates a mouse
cursor onto a weather box, which used to move a weather box text
below its' initial position.

4) Apart from that, app main page received MANY different changes to
improve its' scalability over most device types, improve user
interface and overall experience of using the page.

<br><hr>

**[1.1.0] Create landing page**
<br>
_04.06.2021_

(No description provided)

<br><hr>

**[1.0.3] Merge branch 'main' with a source project**
<br>
_03.06.2021_

(No description provided)

<br><hr>

**[1.0.2] Add apology message at the landing page**
<br>
_03.06.2021_

(No description provided)

<br><hr>

**[1.0.1] Move anime.js and webfonts from .gitignore to repo**
<br>
_03.06.2021_

(No description provided)

<br><hr>

**[1.0.0] 1.0.0**
<br>
_02.06.2021_

* Set 1.0.0 app version release date to
02.06.2021. Uploaded the project to Heroku hosting provider.

<br>

<hr>
<hr>
<hr>

<br>

**[0.5.3] Add slash '/' after public directory in app.js**
<br>
_02.06.2021_

(No description provided)

<br><hr>

**[0.5.2] Change external links from http to https**
<br>
_02.06.2021_

(No description provided)

<br><hr>

**[0.5.1] Changed package json - added pug to dependecies**
<br>
_02.06.2021_

(No description provided)

<br><hr>

**[0.5.0] Resolve CSP conflict**
<br>
_02.06.2021_

CSP conflict is now resolved, everything necessary got whitelisted, so
in this case all things work properly.

<br><hr>

**[0.4.0] Add helmet and compression modules**
<br>
_31.05.2021_

(No description provided)

<br><hr>

**[0.3.4] Merge branch 'main' with a source project**
<br>
_28.05.2021_

(No description provided)

<br><hr>

**[0.3.3] Initial commit**
<br>
_28.05.2021_

(No description provided)

<br><hr>

**[0.3.2] Data visualised correctly**
<br>
_28.05.2021_

Data now functions correctly based on query!!!

<br><hr>

**[0.3.1] City name on detailed page appears correctly**
<br>
_28.05.2021_

City name appears well based on query, so almost everything works well
for now. Only data remains invalid, but just for now. That's the main
goal for now!

<br><hr>

**[0.3.0] Make city name appears at the URL**
<br>
_28.05.2021_

City now appears at the URL ! Now we only have to read the city name and
finally attach it to our URL in order to send correct weather data.

<br><hr>

**[0.2.3] Work on submit - receive process**
<br>
_27.05.2021_

A bit of things in this matter added, but for now this submit data need
to be somehow used in the url to actually respond with appropiate data

<br><hr>

**[0.2.2] Attach detail page to the app**
<br>
_27.05.2021_

App now contains detail app, but for now it needs to be configured so
that it looks cool also on mobile devices. The second major issue is
of course setup a connection from page to page, sending city name to
detail page in order to render correctly.

<br><hr>

**[0.2.1] Endorse detailed app page in process**
<br>
_27.05.2021_

Added some new files as well as some new changes regards to switching
through app main page and detailed page.

<br><hr>

**[0.2.0] Add comment in all_Pages.js**
<br>
_27.05.2021_

(No description provided)

<br><hr>

**[0.1.7] Add final changes to portrait screens**
<br>
_26.05.2021_

Everything is now finally working as a static website content. The app
now is not that much reliant on scripts - instead it is more about
HTML static content with a mix of dynamic JS stuff.

<br><hr>

**[0.1.6] Improved portrait state screens**
<br>
_26.05.2021_

Remain to-dos: it's only portrait screen (for real!)

<br><hr>

**[0.1.5] Updated style css to perform well for desktop PC's well**
<br>
_26.05.2021_

(No description provided)

<br><hr>

**[0.1.4] Add huge changes for static content**
<br>
_26.05.2021_

Remodeling the files for making the styles fit appropiately to the
flow.

<br><hr>

**[0.1.3] Correct styles and functionality with search usage**
<br>
_26.05.2021_

Adjusted styles to normal static stuff and also removed cityName div
(now we only have .city class, which is perfectly fine)

<br><hr>

**[0.1.2] Change dynamic JS DOM creation to static HTML**
<br>
_26.05.2021_

We first comment out first() function - not removing it yet - and
update app_page.pug with equivalent, but static contentent.

<br><hr>

**[0.1.1] First approach to add a href to dynamic content**
<br>
_26.05.2021_

(No description provided)

<br><hr>

**[0.1.0] Initialize repository with .gitignore file**
<br>
_26.05.2021_

(No description provided)

<br>
