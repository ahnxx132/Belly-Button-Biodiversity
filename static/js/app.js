// This code is inspired by Doms tutorial on HW14.
// Define a overarching variable to hold the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"; 


// let selector = d3.select("#selDataset"); talking to html of an id of selDataset. Initialize the dropdown. Get a handle to the selector/ dropdown.
// You have assigned a function called InitDashboard that holds a lot of functions. first fetches the JSON data url;  then read all the data and store into the text data.
// a number shown on the dropdown (front end screen) and values behind the scenes. now you've created a property/key called .property("value") that holds the sampleId numbers.

function InitDashboard() { 
    let selector = d3.select("#selDataset"); 
    d3.json(url).then((data) => {
        console.log("Here's the data:", data); 
        let sampleNames = data.names; 
        console.log("Here are the sample names:", sampleNames); // 940, 941, 943, ...
        // Populate the dropdown box
        for (let i = 0; i < sampleNames.length; i++) {
            let sampleId = sampleNames[i]; 
            console.log("Here are the sample IDs:", sampleId );
            selector.append("option").text(sampleId).property("value", sampleId); 
        };      

        // Read the current value from the dropdown
        let initialId = selector.property("value");
        console.log(`initialId = ${initialId}`); 

        DrawBargraph(initialId); 

        // Draw the bubblechart for the selected sample id
        DrawBubblechart(initialId); 

        // Show the metadata for the selected sample id 
        ShowMetadata(initialId); 

        // Show the gauge
        DrawGauge(initialId); 

    }); 
}


function DrawBargraph(sampleId)
{
    console.log(`DrawBargraph(${sampleId})`); 

    d3.json(url).then((data) => {

        let samples = data.samples; 
        function Samples(object) {return object.id == sampleId}; //pulls out the id of 940
        let resultArray = samples.filter(Samples); //and outs it into this array, resultArray
        let result = resultArray[0]; //gives me the first value in this array. 

        let otu_ids = result.otu_ids; 
        // console.log("otu_ids:", otu_ids);
        let otu_labels = result.otu_labels; 
        let sample_values = result.sample_values; 

        let yticks = otu_ids.slice(0, 10).map(otuId => `OTU ${otuId}`).reverse();
        // for each thing we find in the otu_ids array, only the first 10 values of it, for each otuId i find im going to create OTU ${otuId} string and gonna put the string in y ticks

        // Create a trace object
        let barData = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: 'bar', 
            text: otu_labels.slice(0, 10).reverse(),
            orientation: 'h'
        }; 

        // to put multiple traces for my layout object. the trace object into an array
        let barArray = [barData]; 

        // Create a layout object
        let barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        }

        // Call the Plotly function 
        Plotly.newPlot("bar", barArray, barLayout); 

    }); 
}

function DrawBubblechart(sampleId)
{
    console.log(`DrawBubblechart(${sampleId})`); 

    d3.json(url).then(data => {

        let samples = data.samples; 
        let resultArray = samples.filter(object => object.id == sampleId); 
        // sample that has an id that's equal to the parameter sampleId in DrawBubblechart(sampleId). filtering on that sampleId. 
        let result = resultArray[0]; 

        let otu_ids = result.otu_ids; 
        let otu_labels = result.otu_labels; 
        let sample_values = result.sample_values; 

        // Create a trace
        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels, 
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Put the trace into an array
        let bubbleArray = [bubbleData]; 

        // Create a layout object
        let bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 30, l: 150},
            hovermode: "closest", 
            xaxis: { title: "OTU ID"}
        };

        // Call Plotly
        Plotly.newPlot("bubble", bubbleArray, bubbleLayout); 

    }); 










}

function DrawGauge(sampleId)
{
    console.log(`DrawGauge(${sampleId})`); 
}


function ShowMetadata(sampleId) {d3.json(url).then((data) => {
    let metadata= data.metadata; // gives you all the keys in the metadata from ID=940-1601.
    // Samples is a filter function that has an object sampleobject which will only spit out the id numbers that you pick on the interface.
    console.log(metadata[0]);
    console.log(metadata.id); // = undefined.
    console.log("this is the metadata:", metadata);
    console.log("what is the sample?:", sampleId); //
    function Samples(object) {return object.id == sampleId};
    let Metaarray= metadata.filter(Samples);
    let Metaresult= Metaarray[0] // id = 940
    // communicating with id on index.html. Capture the HTML of a selection
    let panel = d3.select("#sample-metadata").html("");
    Object.entries(Metaresult).forEach(([key, value]) => {panel.append("h6").text(`${key}: ${value}`); });
    });
}


function optionChanged(sampleId)
{
    console.log(`optionChanged, new value: ${sampleId}`); 

    DrawBargraph(sampleId); 
    DrawBubblechart(sampleId); 
    ShowMetadata(sampleId); 
    DrawGauge(sampleId); 
}



// calling the function for the function to run.
InitDashboard(); 
