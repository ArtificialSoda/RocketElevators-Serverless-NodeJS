/*** AUTHOR: Fabien H. Dimitrov  ************************************************************************/
/*** CONTEXT: Rocket Elevators (Codeboxx) **************************************************************/
/*** DESCRIPTION: Calculates the estimated cost for a client's elevator project, on the server side ***/

/** Use Node.js modules ****************************/

    // Create Express application (includes methods for routing HTTP requests, middleware config, etc.
    const express = require('express');
    const app = express(); 

    // Handle POST requests
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({
        extended: false
    }));

    // Allow usage of JSON
    app.use(bodyParser.json());
    
    // Define the 'public' folder as static - contains all static HTML, CSS and JS files
    app.use(express.static('public'));

    // Enable Cross-Origin Resource Sharing (CORS) 
    var cors = require('cors');
    app.use(cors());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
        )
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    
        next();
    });

/** Start server on specified port ***************/
    const port = process.env.PORT || 3030;
    app.listen(port, () => console.log(`Server active on port ${port}...`));

/** Calculate cost estimate **********************/

    /* Building: RESIDENTIAL */
    app.post('/residential', (req, res) => {
        
        // Load inputs from POST request body
        let 
        {

            numApartments,
            numFloors,
            numBasements,
            unitBasePrice,
            installFee

        } = req.body;

        // Calculate average number of appartments per floor
        var numRealFloors = numFloors - numBasements;
        var avgApartmentsPerFloor = Math.ceil(numApartments / numRealFloors);

        // Calculate number of elevators per floor
        var numElevatorsPerFloor = Math.ceil(avgApartmentsPerFloor / 6);

        // Calculate number of columns 
        var numColumns = Math.ceil(numFloors / 20);

        // Calculate number of elevators
        var totalElevators = numElevatorsPerFloor * numColumns; 

        if (isNaN(totalElevators) || totalElevators < 0)
            totalElevators = 0;
    
        // Calculate elevator cost
        var elevatorCost = totalElevators * unitBasePrice;

        // Calculate installation cost
        var installationCost = elevatorCost * installFee;

        // Calculate total cost
        var totalCost = elevatorCost + installationCost;

        // Send HTML POST response through JSON
        res.json
        ({

            totalElevators: totalElevators,
            elevatorPrice: elevatorCost,
            installationPrice: installationCost,
            totalEstimate: totalCost

        });
        
    });

    /* BUILDING: Commercial */
    app.post('/commercial', (req, res) => {
        
        // Load inputs from POST request body
        let 
        {
            numCages,
            unitBasePrice,
            installFee

        } = req.body;

        // Number of elevators
        var totalElevators = numCages;

        // Calculate elevator cost
        var elevatorCost = totalElevators * unitBasePrice;

        // Calculate installation cost
        var installationCost = elevatorCost * installFee;

        // Calculate total cost
        var totalCost = elevatorCost + installationCost;

        // Send HTML POST response through JSON
        res.json
        ({

            totalElevators: totalElevators,
            elevatorPrice: elevatorCost,
            installationPrice: installationCost,
            totalEstimate: totalCost

        });

    });

    /* BUILDING: Corporate & Hybrid */
    app.post('/corporate-hybrid', (req, res) => {

        let
        {

            numOccupantsPerFloor,
            numFloors, 
            unitBasePrice,
            installFee

        } = req.body;

        
        // Calculate total occupants
        var totalOccupants = numOccupantsPerFloor * numFloors;

        // Calculate initial number of elevators
        var numElevators = Math.ceil(totalOccupants / 1000);

        // Calculate number of columns
        var numColumns = Math.ceil(numFloors / 20); 

        // Calculate total number of elevators
        var totalElevators = Math.ceil(numElevators / numColumns) * numColumns;

        
        if (isNaN(totalElevators) || totalElevators < 0)
            totalElevators = 0;

        // Calculate elevator cost
        var elevatorCost = totalElevators * unitBasePrice;

        // Calculate installation cost
        var installationCost = elevatorCost * installFee;

        // Calculate total cost
        var totalCost = elevatorCost + installationCost;

        // Send HTML POST response through JSON
        res.json
        ({

            totalElevators: totalElevators,
            elevatorPrice: elevatorCost,
            installationPrice: installationCost,
            totalEstimate: totalCost

        });

    });
