# Cazana Task

## Usage
### Prerequisites
You will need to have NodeJS (version >= 12.13) and npm (version >= 6.14). Using previous
versions does not guarantee that the program will run correctly.

### Installation
First, you will need to install the dependencies. From the command line run:
```shell
npm install
```

### Running the tests
To run the tests use the command:
```shell
npm test
```


***
## Assumptions

* The first-registration-date field ONLY refers to the specific VRM and NOT the registration
  date at first purchase. This implies that one has to check if the specific car has any
  prior vrm-change events in its timeline in order to gather the entire car's timeline.
  <br/>
  <br/>
* The timeline array of events of a specific car, can contain AT MOST ONE vrm-change event
  indicating the previous VRM and ONE vrm-change event indicating the next VRM. This reduces
  the data duplication (by avoiding the storage of the same events multiple times) and also
  allows for the timeline of a car to be modeled as a directed graph that can be traversed
  using the VRM as the key: Each vehicle only 'knows' about its direct ancestor and successor.
  <br>
  <br>
* When calculating the average-mileage, only the latest two events are used, and the rest are 
 ignored. The decision was based on data found 
  [here](https://www.bymiles.co.uk/insure/magazine/mot-data-research-and-analysis/) which shows
  that there is a decreasing trend in the annual mileage of vehicles over the last few years.
  This makes older mileage values less reliable estimators of the current average mileage.
