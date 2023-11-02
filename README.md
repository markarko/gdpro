# GDPro(Seyed Amirreza Mojtahedi, Thomas Proctor, Marko Yaroslavo Litovchenko)

## Overview
This project aims to develop a web application using the MERN (MongoDB, Express.js, React.js, Node.js) stack to analyze the correlation between GDP per capita and protein intake per capita across different countries. The data for this analysis will be sourced from the Our World in Data website, providing a comprehensive and reliable dataset for a meaningful exploration of the relationship between economic prosperity and nutritional habits.

### Data Integration

Utilize the Our World in Data datasets to fetch GDP per capita and protein intake per capita information for various countries.
Implement a data pipeline to clean, transform, and store the acquired data in MongoDB.

### Dashboard

Design an interactive dashboard using React.js to display a summary of the data and key insights.
Include visual elements such as charts and graphs to present the correlation between GDP per capita and protein intake per capita.

### Data Analysis

Provide users with the ability to filter data based on date or country.

### Chart Generation

Integrate Chart.js to create dynamic and visually appealing charts.
Generate scatter plots, line graphs, or other relevant charts to illustrate the correlation patterns.

### Responsive Design

Ensure a responsive and user-friendly design to accommodate users on various devices, including desktops, tablets, and mobile phones.
Performance Optimization:
Optimize the application's performance by implementing server-side rendering and lazy loading for efficient data retrieval and presentation.

# APIs used

# Attributions 

The open data used in this app is provided by Our World in Data. The data is stored in a Mongo Database and is used to create the map chart.

## Structure

## Setup

To install all the dependencies and build the React app run:

```
npm run build
```

## To run the app

### Just the client

If `client/package.json` has a `proxy` line, remove it. 

```
cd ./client
npm start
```

### Just the server

```
node ./server/bin/www
```

### Client and Server

```
node ./server/bin/www
```
in another terminal:

```
cd ./client
npm start
``` 