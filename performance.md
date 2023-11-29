# Performance of GDPro 

## Introduction and Methodology
The performance of GDPro website was assessed using Chrome V119 browser with a cable connection from Virginia. The performance metrics were gathered using www.webpagetest.org.
> The site costs $0.14 in whatdoesmysitecost before the changes

> Now through lighthouse, and webpagetest, and the overall results were actually really surprising

![Alt text](/perf-screenshots/screenshot1.PNG)
![Alt text](/perf-screenshots/screenshot2.PNG)
![Alt text](/perf-screenshots/screenshot3.PNG)

While these results may not seem great at first glance, when we get into details for why some of these sites report low site numbers we can see that a lot of these issues are somewhat unrelated to the actual site and code written.


## Baseline Performance
The baseline performance for this was application are simply displayed above, the metrics above represent what we were working with before without changes. 
Still a very good result in my opinion considering most of the improvements we could make are actually only to the external react components were using,
and very little of them are issues with our code (Long wait times, large data downloads, etc).


### First Opportunity for improvement
**Cache policies**
The first thing that we need to tackle is our cache policies (or lack-there of)
By implementing a cache policy header inside of our ApiUtils send method we can make it so it sends cache policy headers and forces the browser to cache any api calls made.


### Second opportunity for improvement
**Render blocking JS and CSS**
Well in terms of render blocking css, unfortunately without modifications to the component, we can't make any changes. 
The render blocking css, after a little digging unfortunately belongs to the chart, so theres not much we can do, 
although on further analysis it doesn't seem like there is an insane amount of css, it still causes the site to not fully load until its ready.


### Third oppurtunity for improvement
**8 resources are not being loaded over a secure connection e.g. https.**
Loading resources over a secure connection is important because it ensures that the data is not being intercepted by a third party. This can be fixed by changing the url of the resources to https.


### Fourth oppurtunity for improvement
**The initial performance analysis revealed that the GDPro website has 4 accessibility issues according to the Axe tool. These include 2 critical and 2 serious issues.**
1. One of the serious issues the accessibi lty has is that some input elements are using the samed id while ids are meant to be unique. This can be fixed by using a class instead of an id.
2. Some input tags do not have labels.
3. Font size for all elements must increase.
4. Select Element Must Have An Accessible Name


### Fifth oppurtunity for improvement
**This issue was observed during manual testing of the website rather than a diagnostic tool**
There currently is a 1.5 second delay after every 5 completed questions in the quiz view. This prevents the user
to experience a smooth flow between all questions.


### Sixth oppurtunity for improvement
**This issue was observed during manual testing of the website rather than a diagnostic tool**
There currently is a 1-1.5 second delay every time the map and chart views are loaded before the map/chart can be seen, the
reason being that the map/chart aren't being rendered until the initial data is fetched. Due to that, the fetch is blocking the
rendering of the components.


## Areas to Improve


## First way 
1. By simply modifying the response headers and adding a 1 year cache control we should be able to cache requests to the api for up to 1 year
2. This would lead to slightly better load times on relaunch of the application and snappier responses in general for previous requests made ot the APPI


## Second way
1. No real improvements could be made other then seeing if the components support a much more minified and stripped down version of their JS and css


### Third way to improve
8 resources are not being loaded over a secure connection e.g. https.
**To set up HTTPS for connections in this web application, the following steps can be taken:**


1. Obtain an SSL/TLS certificate: HTTPS requires a valid SSL/TLS certificate to encrypt the communication between the server and the client. Obtain a certificate from a trusted certificate authority (CA) or use a self-signed certificate for development purposes.


2. Configure the web server: Once the SSL/TLS certificate is there, the web server must be configured to enable HTTPS. The https module can be used to create an HTTPS server and provide the necessary certificate and private key.


3. Redirect HTTP to HTTPS: To ensure that all connections are secure, it is recommended to redirect HTTP requests to HTTPS. This can be done by adding a redirect rule to the web server configuration or by using middleware in the application code.


### Fourth way to improve
#### Critical Issues
1. Form Elements Must Have Labels:
- Multiple form elements lack appropriate labels.
- Active elements with the same ID attribute were identified, specifically in the year-slider input.
2. Select Element Must Have an Accessible Name:
- Select elements do not have an implicit or explicit label.
- The default semantics were not overridden with role="none" or role="presentation".
#### Serious Issues
1. Elements Must Have Sufficient Color Contrast:
- Several elements exhibit insufficient color contrast, impacting accessibility.
2. IDs Of Active Elements Must Be Unique:
- Active elements with the same ID attribute (year-slider) were found.


### Fifth way to improve

In our quiz view, we have a section with the answer options, a map, and a chart that contains the relevant data
that should be used to guess the correct answer. We are fetching 5 questions at a time, such that 5 questions
are fetched once the page is loaded, and another batch of questions as soon as the user went over those 5 questions.
During those subsequent fetches however, the user is not only left with an empty screen (except nav and footer which
are always there), but also a wait time of around 1-1.5 seconds while the questions are being fetched. This is not
the most user-friendly way of handling it so I thought about using pre-fetching as a solution. As soon as the user goes
to the 5th and last question, the script will make a non blocking fetch of the next 5 questions, such that whenever
the user answers and proceeds to the next question, the next batch of questions will be ready to use. That will avoid 
any kind of UI interuption and will generate a smooth flow between the quiz questions.

### Sixth way to improve
**This issue was observed during manual testing of the website rather than a diagnostic tool**

Similar to the 5th opportunity, our chart and map views only loaded the visualization component around 1.5 seconds
after page access, since it was waiting for some initial data to be fetched before and only the nav/footer could be
seen instantly. We got around this by rendering the map and chart components right away and then populating those
with data as soon as it's fetched. Now this will actually cause 2 "initial" renders for the chart and map instead of 1, however from
the user perspective it becomes much more conveninent in terms of loading speed.


## Summary of Changes 
### Improve accessibility of the site

Lead: Seyed Amirreza Mojtahedi

1. Simply avoid using ids for the year-slider input and use a class instead. This will fix the issue of having multiple elements with the same id.
2. Use the label tag to add labels to the input elements. This will fix the issue of having input elements without labels.
3. Increase the font size of all elements to 16px. This will fix the issue of having small font sizes.

**These changes do not improve the performance of the site however, they drastically improve the user experience especially the ones with disabilities or imparities.**

### Load resources over a secure connection
Lead: Seyed Amirreza Mojtahedi
Make sure all resources are loaded over a secure connection by changing the url of the resources to https.

**Using https does not improve the performace but ensures that the data being passed around is always encrypted and cannot be read by the middle men. Having a webiste using https protocal increases the liability of it.**

### Adding caching headers to requests

Lead: Thomas Proctor

1. The change made was adding control cache headers onto the responses being sent out
2. This change was very simple and only required passing through a new variable into out apiUtils sendResponse

### Improve quiz question loading

Lead: Marko Litovchenko
1. Since questions are fetched in a batch of 5, I pre-fetch the next set of 5 questions when the user arrives to the last question, such that
the 6th, 11th, 16th... question would be instantly accessible
2. I also added caching for quiz questions to prevent fetching random questions every time the quiz view is visited

### Improve map/chart views loading

Lead: Marko Litovchenko
1. I moved the initial fetch to the App component, since the MapView and ChartView components shared nearly the same initial fetch
2. I removed the loading mechanism that would return an empty div while waiting for the fetch and loaded the chart/map right away
with some starting data while waiting for the initial fetch to be completed.

# Results and conclusion:

The performance and user experience has improved drastically. 
Not only from the new snappy cached requests but also the massive improvements when it came to pre-rendering the chart and map before the fetch request was finished.
The metrics we used for determining the performance of the sight beforehand don't really show the full story but when it comes to user interaction with the site whether its on mobile or desktop, the experience feels a lot more snappy and responsive while also helping not send as many requests to the server.

# Missing implementation
The only missing implementation we couldn't complete was implementing memo on all of our components, this was possibly within the scope of the project although we ran out of time unfortunately.