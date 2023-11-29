# Performance of GDPro by Seyed Amirreza Mojtahedi

## Introduction and Methodology
The performance of GDPro website was assessed using Chrome V119 browser with a cable connection from Virginia. The performance metrics were gathered using www.webpagetest.org.
> The site costs $0.14 in whatdoesmysitecost before the changes

## Baseline Performance
The baseline performance of the GDPro website was assessed using the Lighthouse tool in Chrome V119 browser. The performance metrics are shown below.

### First oppurtunity for improvement
**The initial performance analysis revealed that the GDPro website has 4 accessibility issues according to the Axe tool. These include 2 critical and 2 serious issues.**
1. One of the serious issues the accessibilty has is that some input elements are using the samed id while ids are meant to be unique. This can be fixed by using a class instead of an id.
2. Some input tags do not have labels.
3. Font size for all elements must increase.
4. Select Element Must Have An Accessible Name

### Second oppurtunity for improvement
**8 resources are not being loaded over a secure connection e.g. https.**

Loading resources over a secure connection is important because it ensures that the data is not being intercepted by a third party. This can be fixed by changing the url of the resources to https.

## Areas to Improve
### First oppurtunity for improvement
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

### Second oppurtunity for improvement
8 resources are not being loaded over a secure connection e.g. https.
**To set up HTTPS for connections in this web application, the following steps can be taken:**

1. Obtain an SSL/TLS certificate: HTTPS requires a valid SSL/TLS certificate to encrypt the communication between the server and the client. Obtain a certificate from a trusted certificate authority (CA) or use a self-signed certificate for development purposes.

2. Configure the web server: Once the SSL/TLS certificate is there, the web server must be configured to enable HTTPS. The https module can be used to create an HTTPS server and provide the necessary certificate and private key.

3. Redirect HTTP to HTTPS: To ensure that all connections are secure, it is recommended to redirect HTTP requests to HTTPS. This can be done by adding a redirect rule to the web server configuration or by using middleware in the application code.


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

## Conclusion
The changes made to address the identified accessibility and security issues will likely have a positive impact on the overall user experience of the GDPro website.
