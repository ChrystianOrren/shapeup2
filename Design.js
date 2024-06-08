import React, { useState, useEffect, useRef } from 'react';
import { View, PanResponder, StyleSheet, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';


const storage = new Storage({
    // Maximum capacity, default is 1000
    size: 1000,
    // Data expire time, default is null, never expires
    defaultExpires: null,
    // Cache data, default is true
    enableCache: true,
    // Storage system for data, default is AsyncStorage
    storageBackend: AsyncStorage,
});

const Design = ({ route }) => {
    // Called on page mount
    useEffect(() => {
        calcPoints();
        loadOutline();
        loadMeasurementXs();
    }, []);

    {/* Variables */}
    const { data } = route.params; // Data sent from dashboard
    const tail = data[4];
    const viewRef = useRef();

    // Radius size scaled for length
    const radius = 1 + (data[1] / 12);
    const lineWidth = (data[1] / 24);
    const lineColor = "#FFB2E6";
    const outlineBgColor = "#2C363F";

    // Board dims in inches 
    const boardLen = (parseFloat(data[1]) * 12) + parseFloat(data[2]); 
    const boardWid = parseFloat(data[3]);

    // Variables used in setting up Svg
    const [ widePointY, setWidePointY ] = useState(0);
    const [ widePointLeft, setWidePointLeft ] = useState(0);
    const [ widePointRight, setWidePointRight ] = useState(0);
    const [ nosailX, setNosailX ] = useState(0);
    const [ noseY, setNoseY ] = useState(0);
    const [ tailY, setTailY ] = useState(0);

    //Measurment X's
    const [ noseXLeft, setNoseXLeft ] = useState(1);
    const [ noseXRight, setNoseXRight ] = useState(boardWid+1);
    const [ tailXLeft, setTailXLeft ] = useState(1);
    const [ tailXRight, setTailXRight ] = useState(boardWid+1);

    // Curves
    const [ path3X, setPath3X ] = useState(0);
    const [ path3Y, setPath3Y ] = useState(0);
    const [ path4X, setPath4X ] = useState(0);
    const [ path4Y, setPath4Y ] = useState(0);

    // Control Points for Cubic Bézier Curve
    const [ r1x, setr1x ] = useState(0);
    const [ r1y, setr1y ] = useState(0);
    const [ r2x, setr2x ] = useState(0);
    const [ r2y, setr2y ] = useState(0);
    const [ l1x, setl1x ] = useState(0);
    const [ l1y, setl1y ] = useState(0);
    const [ l2x, setl2x ] = useState(0);
    const [ l2y, setl2y ] = useState(0);

    // Coordinates for draggable circles. controls cubic curve points
    // const [ dotx, setDotX ] = useState(boardWid + 5);
    // const [ doty, setDotY ] = useState(20);
    // const [ dot2x, setDot2X ] = useState(boardWid + 5);
    // const [ dot2y, setDot2Y ] = useState(5);
    const [ dot3x, setDot3X ] = useState(boardWid - 15);
    const [ dot3y, setDot3Y ] = useState(boardLen-1);
    const [ dot4x, setDot4X ] = useState(boardWid - 20);
    const [ dot4y, setDot4Y ] = useState(boardLen-20);
    const [ dot5x, setDot5X ] = useState(boardWid + 5);
    const [ dot5y, setDot5Y ] = useState(boardLen-10);
    const [ dot6x, setDot6X ] = useState(boardWid + 5);
    const [ dot6y, setDot6Y ] = useState(20);

    // Variables for Tail Shapes const [  ,  ] = useState();
    const [ standardLineX1 , setStandardLineX1 ] = useState(0);
    const [ standardLineY1 , setStandardLineY1 ] = useState(0);
    const [ standardLineX2 , setStandardLineX2 ] = useState(0);
    const [ standardLineY2 , setStandardLineY2 ] = useState(0);
    
    const [ moonLineX1 , setMoonLineX1 ] = useState(0);
    const [ moonLineY1 , setMoonLineY1 ] = useState(0);
    const [ moonLineX2 , setMoonLineX2 ] = useState(0);
    const [ moonLineY2 , setMoonLineY2 ] = useState(0);
    const [ moonCurveX , setMoonCurveX ] = useState(0);
    const [ moonCurveY , setMoonCurveY ] = useState(0);

    const [ diamondLineX1 , setDiamondLineX1 ] = useState(0);
    const [ diamondLineY1 , setDiamondLineY1 ] = useState(0);
    const [ diamondLineX2 , setDiamondLineX2 ] = useState(0);
    const [ diamondLineY2 , setDiamondLineY2 ] = useState(0);
    const [ diamondLineX3 , setDiamondLineX3 ] = useState(0);
    const [ diamondLineY3 , setDiamondLineY3 ] = useState(0);

    const [ swallowLineX1 , setSwallowLineX1 ] = useState(0);
    const [ swallowLineY1 , setSwallowLineY1 ] = useState(0);
    const [ swallowLineX2 , setSwallowLineX2 ] = useState(0);
    const [ swallowLineY2 , setSwallowLineY2 ] = useState(0);
    const [ swallowLineX3 , setSwallowLineX3 ] = useState(0);
    const [ swallowLineY3 , setSwallowLineY3 ] = useState(0);

    const [ fishPathX1 , setFishPathX1 ] = useState(0);
    const [ fishPathY1 , setFishPathY1 ] = useState(0);
    const [ fishPathX2 , setFishPathX2 ] = useState(0);
    const [ fishPathY2 , setFishPathY2 ] = useState(0);
    const [ fishPathX3 , setFishPathX3 ] = useState(0);
    const [ fishPathY3 , setFishPathY3 ] = useState(0);

    const [ fishCurveX1 , setFishCurveX1 ] = useState(0);
    const [ fishCurveY1 , setFishCurveY1 ] = useState(0);
    const [ fishCurveX2 , setFishCurveX2 ] = useState(0);
    const [ fishCurveY2 , setFishCurveY2 ] = useState(0);

    const [ editing, setEditing ] = useState(false);


    {/* Navigation */}
    const navigation = useNavigation();
    const goBack = () => {
        navigation.navigate('Dashboard');
    }

    {/* Functions */}
    // Save Board dimensions to database at the proper key 
    const saveOutline = async () => {
        let rawData = {};
        const key = data[0];
        const lengFt = data[1];
        const lenIn = data[2];
        const widIn = data[3];
        const tail = data[4];

        switch(tail){
            case"Fish":
                rawData = {lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, fishPathX1, fishPathY1, fishPathX2, fishPathY2, fishPathX3, fishPathY3, fishCurveX1, fishCurveY1, fishCurveX2,  fishCurveY2};
                break;
            case"Swallow":
                rawData = {lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, swallowLineX1, swallowLineY1, swallowLineX2, swallowLineY2, swallowLineX3, swallowLineY3};
                break;
            case"Moon":
                rawData = {lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, moonLineX1, moonLineY1, moonLineX2, moonLineY2, moonCurveX, moonCurveY};
                break;
            case"Standard":
                rawData = {lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, standardLineX1, standardLineY1, standardLineX2, standardLineY2};
                break;
            case"Diamond":
                rawData = {lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, diamondLineX1, diamondLineY1, diamondLineX2, diamondLineY2, diamondLineX3, diamondLineY3};
                break;
            default:
                rawData = {lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y};
                break;
        }

        const jsonData = JSON.stringify(rawData);
        console.log(key);
        try {
            await storage.save({
              key: key,
              data: jsonData,
            });
            console.log('Data saved successfully');
          } catch (error) {
            console.error('Error saving data:', error);
          }

        setEditing(!editing);
    }

    // Load board dimensions from database
    const loadOutline = async () => {
        const key = data[0];
        const board = await AsyncStorage.getItem(key);
        const parsedBoard = JSON.parse(board);
        const innerData = JSON.parse(parsedBoard.rawData)
        
        if (innerData.widePointY == undefined) {
            return;
        }

        switch(tail){
            case"Fish":
                setWidePointY(innerData.widePointY);
                setPath3X(innerData.path3X);
                setPath3Y(innerData.path3Y);
                setPath4X(innerData.path4X);
                setPath4Y(innerData.path4Y);
                setr1x(innerData.r1x);
                setr1y(innerData.r1y);
                setr2x(innerData.r2x);
                setr2y(innerData.r2y);
                setl1x(innerData.l1x);
                setl1y(innerData.l1y);
                setl2x(innerData.l2x);
                setl2y(innerData.l2y);
                setFishPathX1(innerData.fishPathX1);
                setFishPathY1(innerData.fishPathY1);
                setFishPathX2(innerData.fishPathX2);
                setFishPathY2(innerData.fishPathY2);
                setFishPathX3(innerData.fishPathX3);
                setFishPathY3(innerData.fishPathY3);
                setFishCurveX1(innerData.fishCurveX1);
                setFishCurveY1(innerData.fishCurveY1);
                setFishCurveX2(innerData.fishCurveX2);
                setFishCurveY2(innerData.fishCurveY2);
                break;
            case"Swallow":
                setWidePointY(innerData.widePointY);
                setPath3X(innerData.path3X);
                setPath3Y(innerData.path3Y);
                setPath4X(innerData.path4X);
                setPath4Y(innerData.path4Y);
                setr1x(innerData.r1x);
                setr1y(innerData.r1y);
                setr2x(innerData.r2x);
                setr2y(innerData.r2y);
                setl1x(innerData.l1x);
                setl1y(innerData.l1y);
                setl2x(innerData.l2x);
                setl2y(innerData.l2y);
                setSwallowLineX1(innerData.swallowLineX1);
                setSwallowLineY1(innerData.swallowLineY1);
                setSwallowLineX2(innerData.swallowLineX2);
                setSwallowLineY2(innerData.swallowLineY2);
                setSwallowLineX3(innerData.swallowLineX3);
                setSwallowLineY3(innerData.swallowLineY3);
                break;
            case"Moon":
                setWidePointY(innerData.widePointY);
                setPath3X(innerData.path3X);
                setPath3Y(innerData.path3Y);
                setPath4X(innerData.path4X);
                setPath4Y(innerData.path4Y);
                setr1x(innerData.r1x);
                setr1y(innerData.r1y);
                setr2x(innerData.r2x);
                setr2y(innerData.r2y);
                setl1x(innerData.l1x);
                setl1y(innerData.l1y);
                setl2x(innerData.l2x);
                setl2y(innerData.l2y);
                setMoonLineX1(innerData.moonLineX1);
                setMoonLineY1(innerData.moonLineY1);
                setMoonLineX2(innerData.moonLineX2);
                setMoonLineY2(innerData.moonLineY2);
                setMoonCurveX(innerData.moonCurveX);
                setMoonCurveY(innerData.moonCurveY);

                break;
            case"Standard":
                setWidePointY(innerData.widePointY);
                setPath3X(innerData.path3X);
                setPath3Y(innerData.path3Y);
                setPath4X(innerData.path4X);
                setPath4Y(innerData.path4Y);
                setr1x(innerData.r1x);
                setr1y(innerData.r1y);
                setr2x(innerData.r2x);
                setr2y(innerData.r2y);
                setl1x(innerData.l1x);
                setl1y(innerData.l1y);
                setl2x(innerData.l2x);
                setl2y(innerData.l2y);
                setStandardLineX1(innerData.standardLineX1);
                setStandardLineY1(innerData.standardLineY1);
                setStandardLineX2(innerData.standardLineX2);
                setStandardLineY2(innerData.standardLineY2);
                break;
            case"Diamond":
                setWidePointY(innerData.widePointY);
                setPath3X(innerData.path3X);
                setPath3Y(innerData.path3Y);
                setPath4X(innerData.path4X);
                setPath4Y(innerData.path4Y);
                setr1x(innerData.r1x);
                setr1y(innerData.r1y);
                setr2x(innerData.r2x);
                setr2y(innerData.r2y);
                setl1x(innerData.l1x);
                setl1y(innerData.l1y);
                setl2x(innerData.l2x);
                setl2y(innerData.l2y);
                setDiamondLineX1(innerData.diamondLineX1);
                setDiamondLineY1(innerData.diamondLineY1);
                setDiamondLineX2(innerData.diamondLineX2);
                setDiamondLineY2(innerData.diamondLineY2);
                setDiamondLineX3(innerData.diamondLineX3);
                setDiamondLineY3(innerData.diamondLineY3);
                break;
            default:
                setWidePointY(innerData.widePointY);
                setPath3X(innerData.path3X);
                setPath3Y(innerData.path3Y);
                setPath4X(innerData.path4X);
                setPath4Y(innerData.path4Y);
                setr1x(innerData.r1x);
                setr1y(innerData.r1y);
                setr2x(innerData.r2x);
                setr2y(innerData.r2y);
                setl1x(innerData.l1x);
                setl1y(innerData.l1y);
                setl2x(innerData.l2x);
                setl2y(innerData.l2y);
                break;
        }
    }

    // Allow for outline editing
    const editOutline = () => {
        setEditing(!editing);
        loadMeasurementXs();
    }

    // Initalizes Svg data.
    const calcPoints = () => {
        // Points
        let midX = (boardWid + 2) / 2;
        setWidePointY(boardLen / 2)
        setNosailX(midX)
        setWidePointRight((boardWid + 2)-1);
        setWidePointLeft(1);
        setNoseY(1);
        setTailY(boardLen+1);

        // Tail Paths
        setPath3X(midX - 10);
        setPath4X(midX + 10);
        setPath3Y((boardLen+1) - 3);
        setPath4Y((boardLen+1) - 3);

        // Nose Control points
        setr1x(boardWid+2);
        setr1y(0);
        setr2x(boardWid+2);
        setr2y(0);

        // Tail Shape Stuff
        setStandardLineX1(midX - 3);
        setStandardLineY1(boardLen+1);
        setStandardLineX2(midX + 3);
        setStandardLineY2(boardLen+1);

        setMoonLineX1(midX - 3);
        setMoonLineY1(boardLen+1);
        setMoonLineX2(midX + 3);
        setMoonLineY2(boardLen+1);
        setMoonCurveX(midX);
        setMoonCurveY(boardLen-4);

        setDiamondLineX1(midX - (boardWid / 3));
        setDiamondLineY1(boardLen - 3);
        setDiamondLineX2(midX + (boardWid / 3));
        setDiamondLineY2(boardLen - 3);
        setDiamondLineX3(midX);
        setDiamondLineY3(boardLen+1);

        setSwallowLineX1(midX - 3);
        setSwallowLineY1(boardLen+1);
        setSwallowLineX2(midX + 3);
        setSwallowLineY2(boardLen+1);
        setSwallowLineX3(midX);
        setSwallowLineY3(boardLen - 4);

        setFishPathX1(midX - (boardWid / 2) - 1);
        setFishPathY1(boardLen+1);
        setFishPathX2(midX + (boardWid / 2) + 1);
        setFishPathY2(boardLen+1);
        setFishPathX3(midX);
        setFishPathY3(boardLen - 5);

        setFishCurveX1(midX - 1);
        setFishCurveY1(boardLen - 2);
        setFishCurveX2(midX + 1);
        setFishCurveY2(boardLen - 2);
    }

    //Generates PDF and allows for sharing/printing
    const handlePrint = async () => {
        const pdfName = data[0] + 'Outline';
        const pageWidth = 6.5; // in inches
        const pageHeight = 9; // in inches
        const pagesWide = Math.ceil((boardWid / 2) / pageWidth);
        const pagesTall = Math.ceil(boardLen / pageHeight);
    
        let pdfDoc = `
        <html>
            <style>
                @page {
                    size: 8.5in 11in; /* Letter size */
                    margin: 1in; /* 1 inch margin */
                }
                body {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                .page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 9in; /* 11in (page height) - 2in (margins) */
                    width: 6.5in; /* 8.5in (page width) - 2in (margins) */
                    border: 1px solid black;
                    box-sizing: border-box;
                    page-break-before: always;
                    position: relative;
                }
                .coords {
                    position: absolute;
                    z-index: 1;
                }
                .svgCon {
                    position: absolute;
                    z-index: 2;
                }
            </style>
            <body>
                <div class="colCon">
                    <h1 class="title" >ShapeUp</h1>
                    <h1>${data[0]} - ${data[1]}'${data[2]}" x ${data[3]}"</h1>
                    <h2>
                        Your template will print out onto ${pagesWide*pagesTall} pages of US Letter paper.
                        There should be an inch margin around each page. Measure this to check sizing.
                        Arrange the pages in the the proper poster order indicated by (x,y). Cut margins and tape together 
                    </h2>
                    <h2>Thank you for using ShapeUp</h2>
                </div>
        `;

        const calculateMultiplier = (width) => {
            const slope = 0.0733;
            const intercept = 0.2073;
            return slope * width + intercept;
        };
    
        for (let i = 0; i < pagesTall; i++) {
            for (let j = 0; j < pagesWide; j++) {
                // const multiplier = calculateMultiplier(boardWid);
                // const viewBoxX = (j + multiplier) * pageWidth;
                // const viewBoxY = (i) * pageHeight;
                // const viewBoxWidth = pageWidth;
                // const viewBoxHeight = pageHeight;
                const viewBoxX = ((j) * pageWidth)+nosailX;
                const viewBoxY = (i * pageHeight)+1;
                const viewBoxWidth = pageWidth;
                const viewBoxHeight = pageHeight;
                pdfDoc += `
                    <div class="page">
                        <h1 class="coords">(${j}, ${i})</h1>
                        <svg width="${pageWidth}in" height="${pageHeight}in" class="svgCon" viewBox="${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}">
                            <!-- Nose Paths -->
                            <path d="M${widePointRight},${widePointY} C${r1x},${r1y} ${r2x},${r2y} ${nosailX-0.15},${noseY}"
                                fill="none" stroke="black" stroke-width="${lineWidth}" />
                            <!-- Tail Paths -->
                            ${
                                (() => {
                                    switch (tail) {
                                        case "Fish":
                                            return `
                                                <path d="M${widePointRight},${widePointY} Q${path4X},${path4Y} ${fishPathX2},${fishPathY2}"
                                                    fill="none" stroke="black" stroke-width="${lineWidth}" />
                                                <path d="M${fishPathX3},${fishPathY3} Q${fishCurveX2},${fishCurveY2} ${fishPathX2},${fishPathY2}"
                                                    fill="none" stroke="black" stroke-width="${lineWidth}" />
                                            `;
                                        case "Swallow":
                                            return `
                                                <line x1="${swallowLineX2}" y1="${swallowLineY2}"
                                                    x2="${swallowLineX3}" y2="${swallowLineY3}"
                                                    stroke="black" stroke-width="${lineWidth}" />
                                                <path d="M${widePointRight},${widePointY} Q${path4X},${path4Y} ${swallowLineX2-0.1},${swallowLineY2}"
                                                    fill="none" stroke="black" stroke-width="${lineWidth}" />
                                            `;
                                        case "Moon":
                                            return `
                                                <path d="M${widePointRight},${widePointY} Q${path4X},${path4Y} ${moonLineX2},${moonLineY2}"
                                                    fill="none" stroke="black" stroke-width="${lineWidth}" />
                                                <path d="M${moonLineX1},${moonLineY1} Q${moonCurveX},${moonCurveY} ${moonLineX2+0.15},${moonLineY2}"
                                                    fill="none" stroke="black" stroke-width="${lineWidth}" />
                                            `;
                                        case "Standard":
                                            return `
                                                <line x1="${standardLineX1 + (((standardLineX2 - standardLineX1)/2)-0.15)}" y1="${standardLineY1}"
                                                    x2="${standardLineX2}" y2="${standardLineY2}"
                                                    stroke="black" stroke-width="${lineWidth}" />
                                                <path d="M${widePointRight},${widePointY} Q${path4X},${path4Y} ${standardLineX2-0.07},${standardLineY2}"
                                                    fill="none" stroke="black" stroke-width="${lineWidth}" />
                                            `;
                                        case "Diamond":
                                            return `
                                                <line x1="${diamondLineX2}" y1="${diamondLineY2}"
                                                    x2="${diamondLineX3}" y2="${diamondLineY3}"
                                                    stroke="black" stroke-width="${lineWidth}" />
                                                <path d="M${widePointRight},${widePointY} Q${path4X},${path4Y} ${diamondLineX2},${diamondLineY2}"
                                                    fill="none" stroke="black" stroke-width="${lineWidth}" />
                                            `;
                                        default:
                                            return `
                                                <path d="M${widePointRight},${widePointY} Q${path4X},${path4Y} ${nosailX-0.15},${tailY}"
                                                    fill="none" stroke="black" stroke-width="${lineWidth}" />
                                            `;
                                    }
                                })()
                            }
                        </svg>
                    </div>
                `;
            }
        }
    
        pdfDoc += `
            </body>
        </html>
        `;
    
        try {
            const { uri } = await printToFileAsync({
                html: pdfDoc,
                base64: false,
            });
    
            const pdfUri = `${FileSystem.documentDirectory}${pdfName}.pdf`;
            await FileSystem.moveAsync({
                from: uri,
                to: pdfUri,
            });
            
            //navigation.navigate('Template', {pdf: pdfUri});
            await shareAsync(pdfUri);
        } catch (error) {
            console.log("Error generating PDF", error);
        }
    };

    {/* This set of functions helps find the distance between rails at a foot from nose and tail. */}
    const loadMeasurementXs = () => {
        let x1Val = findXforY(13, [widePointLeft, widePointY],[l1x,l1y],[l2x,l2y],[nosailX, noseY]);
        let x2Val = findXforY(13, [widePointRight, widePointY],[r1x,r1y],[r2x,r2y],[nosailX, noseY]);
        if(x1Val !== undefined && x2Val !== undefined){
            setNoseXLeft(x1Val);
            setNoseXRight(x2Val);
        }
        switch(tail){
            case "Fish":
                x1Val = findXforYQuadratic(tailY - 12, [widePointLeft, widePointY], [path3X, path3Y], [fishPathX1, fishPathY1]);
                x2Val = findXforYQuadratic(tailY - 12, [widePointRight, widePointY], [path4X, path4Y], [fishPathX2, fishPathY2]);
                if (x1Val !== undefined && x2Val !== undefined) {
                    setTailXLeft(x1Val);
                    setTailXRight(x2Val);
                }
                break;
            case"Swallow":
                x1Val = findXforYQuadratic(tailY-12, [widePointLeft, widePointY], [path3X, path3Y], [swallowLineX1+0.2,swallowLineY1]);
                x2Val = findXforYQuadratic(tailY-12, [widePointRight, widePointY], [path4X, path4Y], [swallowLineX2-0.2,swallowLineY2]);
                if (x1Val !== undefined && x2Val !== undefined) {
                    setTailXLeft(x1Val);
                    setTailXRight(x2Val);
                }
                break;
            case"Moon":
                x1Val = findXforYQuadratic(tailY-12, [widePointLeft, widePointY], [path3X, path3Y], [moonLineX1+0.1,moonLineY1]);
                x2Val = findXforYQuadratic(tailY-12, [widePointRight, widePointY], [path4X, path4Y], [moonLineX2-0.1,moonLineY2]);
                if (x1Val !== undefined && x2Val !== undefined) {
                    setTailXLeft(x1Val);
                    setTailXRight(x2Val);
                }
                break;
            case"Diamond":
                x1Val = findXforYQuadratic(tailY-12, [widePointLeft, widePointY], [path3X, path3Y], [diamondLineX1,diamondLineY1]);
                x2Val = findXforYQuadratic(tailY-12, [widePointRight, widePointY], [path4X, path4Y], [diamondLineX2,diamondLineY2]);
                if (x1Val !== undefined && x2Val !== undefined) {
                    setTailXLeft(x1Val);
                    setTailXRight(x2Val);
                }
                break;
            case"Standard":
                x1Val = findXforYQuadratic(tailY-12, [widePointLeft, widePointY], [path3X, path3Y], [standardLineX1+0.2,standardLineY1]);
                x2Val = findXforYQuadratic(tailY-12, [widePointRight, widePointY], [path4X, path4Y], [standardLineX2-0.2,standardLineY2]);
                if (x1Val !== undefined && x2Val !== undefined) {
                    setTailXLeft(x1Val);
                    setTailXRight(x2Val);
                }
                break;
            default:
                x1Val = findXforYQuadratic(tailY-12, [widePointLeft, widePointY], [path3X, path3Y], [nosailX+0.15,tailY]);
                x2Val = findXforYQuadratic(tailY-12, [widePointRight, widePointY], [path4X, path4Y], [nosailX-0.15,tailY]);
                if (x1Val !== undefined && x2Val !== undefined) {
                    setTailXLeft(x1Val);
                    setTailXRight(x2Val);
                }
                break;
        }
    }

    function findXforY(targetY, P0, P1, P2, P3) {
        const epsilon = 0.3; // Adjust as needed for precision
    
        for (let t = 0; t <= 1; t += 0.01) {
            const [x, y] = cubicBezier(t, P0, P1, P2, P3);
    
            if (Math.abs(y - targetY) < epsilon) {
                // Found a close enough Y value
                return x;
            }
        }

        return undefined;
    }
    
    function cubicBezier(t, P0, P1, P2, P3) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;
    
        let x = uuu * P0[0] + 3 * uu * t * P1[0] + 3 * u * tt * P2[0] + ttt * P3[0];
        let y = uuu * P0[1] + 3 * uu * t * P1[1] + 3 * u * tt * P2[1] + ttt * P3[1];
    
        return [x, y];
    }

    function findXforYQuadratic(targetY, P0, P1, P2) {
        const epsilon = 0.3; // Adjust as needed for precision
    
        for (let t = 0; t <= 1; t += 0.01) {
            const [x, y] = quadraticBezier(t, P0, P1, P2);
    
            if (Math.abs(y - targetY) < epsilon) {
                // Found a close enough Y value
                return x;
            }
        }
    
        return undefined;
    }
    
    function quadraticBezier(t, P0, P1, P2) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
    
        let x = uu * P0[0] + 2 * u * t * P1[0] + tt * P2[0];
        let y = uu * P0[1] + 2 * u * t * P1[1] + tt * P2[1];
    
        return [x, y];
    }

    {/* Draggable Functions */}
    //Moves Wide-point along the y-axis
    const PanResponderWidePoint = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            setWidePointY(widePointY + (gestureState.dy / 8));
        },
        moveThreshold: 1,
    });

    // Tail shape Customization
    const PanResponderTail = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            // Oh boy this is going to be a long function.
            switch(tail){
                case "Fish":
                    setFishPathX1( fishPathX1 - (gestureState.dx / 8) );
                    setFishPathX2( fishPathX2 + (gestureState.dx / 8) );
                    break;
                case "Swallow":
                    setSwallowLineX1( swallowLineX1 - (gestureState.dx / 8) );
                    setSwallowLineX2( swallowLineX2 + (gestureState.dx / 8) );
                    break;
                case "Moon":
                    setMoonLineX1( moonLineX1 - (gestureState.dx / 8) );
                    setMoonLineX2( moonLineX2 + (gestureState.dx / 8) );
                    break;
                case "Diamond":
                    setDiamondLineX1( diamondLineX1 - (gestureState.dx / 8) );
                    setDiamondLineX2( diamondLineX2 + (gestureState.dx / 8) );
                    break;
                case "Standard":
                    setStandardLineX1( standardLineX1 - (gestureState.dx / 8) );
                    setStandardLineX2( standardLineX2 + (gestureState.dx / 8) );
                    break;
                default:
                    setPath3X( path3X - (gestureState.dx / 8) );
                    setPath4X( path4X + (gestureState.dx / 8) );
                    break;
            }

            // Moves Dot
            setDot3X( dot3x + (gestureState.dx / 8) );
        },
        moveThreshold: 1, // Adjust this value as needed
    });

    // Alters tail rail line
    const PanResponderTailRail = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {

            setPath3X( path3X - (gestureState.dx / 8) );
            setPath4X( path4X + (gestureState.dx / 8) );
            setPath3Y( path3Y + (gestureState.dy / 8) );
            setPath4Y( path4Y + (gestureState.dy / 8) );

            setDot5X( dot5x + (gestureState.dx / 15) );
            setDot5Y( dot5y + (gestureState.dy / 15));

            let x1Val = 0;
            let x2Val = 0;
            switch(tail){
                case "Fish":
                    x1Val = findXforYQuadratic(tailY - 12, [widePointLeft, widePointY], [path3X, path3Y], [fishPathX1, fishPathY1]);
                    x2Val = findXforYQuadratic(tailY - 12, [widePointRight, widePointY], [path4X, path4Y], [fishPathX2, fishPathY2]);
                    if (x1Val !== undefined && x2Val !== undefined) {
                        setTailXLeft(x1Val);
                        setTailXRight(x2Val);
                    }
                    break;
                case"Swallow":
                    x1Val = findXforYQuadratic(tailY-12, [widePointLeft, widePointY], [path3X, path3Y], [swallowLineX1+0.2,swallowLineY1]);
                    x2Val = findXforYQuadratic(tailY-12, [widePointRight, widePointY], [path4X, path4Y], [swallowLineX2-0.2,swallowLineY2]);
                    if (x1Val !== undefined && x2Val !== undefined) {
                        setTailXLeft(x1Val);
                        setTailXRight(x2Val);
                    }
                    break;
                case"Moon":
                    x1Val = findXforYQuadratic(tailY-12, [widePointLeft, widePointY], [path3X, path3Y], [moonLineX1+0.1,moonLineY1]);
                    x2Val = findXforYQuadratic(tailY-12, [widePointRight, widePointY], [path4X, path4Y], [moonLineX2-0.1,moonLineY2]);
                    if (x1Val !== undefined && x2Val !== undefined) {
                        setTailXLeft(x1Val);
                        setTailXRight(x2Val);
                    }
                    break;
                case"Diamond":
                    x1Val = findXforYQuadratic(tailY-12, [widePointLeft, widePointY], [path3X, path3Y], [diamondLineX1,diamondLineY1]);
                    x2Val = findXforYQuadratic(tailY-12, [widePointRight, widePointY], [path4X, path4Y], [diamondLineX2,diamondLineY2]);
                    if (x1Val !== undefined && x2Val !== undefined) {
                        setTailXLeft(x1Val);
                        setTailXRight(x2Val);
                    }
                    break;
                case"Standard":
                    x1Val = findXforYQuadratic(tailY-12, [widePointLeft, widePointY], [path3X, path3Y], [standardLineX1+0.2,standardLineY1]);
                    x2Val = findXforYQuadratic(tailY-12, [widePointRight, widePointY], [path4X, path4Y], [standardLineX2-0.2,standardLineY2]);
                    if (x1Val !== undefined && x2Val !== undefined) {
                        setTailXLeft(x1Val);
                        setTailXRight(x2Val);
                    }
                    break;
                default:
                    x1Val = findXforYQuadratic(tailY-12, [widePointLeft, widePointY], [path3X, path3Y], [nosailX+0.15,tailY]);
                    x2Val = findXforYQuadratic(tailY-12, [widePointRight, widePointY], [path4X, path4Y], [nosailX-0.15,tailY]);
                    if (x1Val !== undefined && x2Val !== undefined) {
                        setTailXLeft(x1Val);
                        setTailXRight(x2Val);
                    }
                    break;
            }
        },
        moveThreshold: 1, // Adjust this value as needed
    });

    // Alters nose rail line
    const PanResponderNoseRail = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {

            setr1y( r1y + (gestureState.dy / 8) );
            setr2y( r2y + (gestureState.dy / 8) );
            setl1y( l1y + (gestureState.dy / 8) );
            setl2y( l2y + (gestureState.dy / 8) );
            setr1x( r1x + (gestureState.dx / 8) );
            setr2x( r2x + (gestureState.dx / 8) );
            setl1x( l1x - (gestureState.dx / 8) );
            setl2x( l2x - (gestureState.dx / 8) );

            setDot6X( dot6x + (gestureState.dx / 15) );
            setDot6Y( dot6y + (gestureState.dy / 15));

            let x1Val = findXforY(13, [widePointLeft, widePointY],[l1x,l1y],[l2x,l2y],[nosailX, noseY]);
            let x2Val = findXforY(13, [widePointRight, widePointY],[r1x,r1y],[r2x,r2y],[nosailX, noseY]);
            if(x1Val !== undefined && x2Val !== undefined){
                setNoseXLeft(x1Val);
                setNoseXRight(x2Val);
            }
        },
        moveThreshold: 1, // Adjust this value as needed
    });

    // Alters tail height for certain shapes (moon, diamon, fish, swallow)
    const PanResponderMoonY = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gestureState) => {
            if (tail == "Moon") {
                setMoonCurveY( moonCurveY + (gestureState.dy / 8) );
            }
            if (tail == "Diamond") {
                setDiamondLineY2( diamondLineY1 + (gestureState.dy / 8) );
                setDiamondLineY1( diamondLineY2 + (gestureState.dy / 8) );
            }
            if (tail == "Swallow") {
                setSwallowLineY3( swallowLineY3 + (gestureState.dy / 8) );
            }
            if (tail == 'Fish') {
                setFishPathY3( fishPathY3 + (gestureState.dy / 8) );
            }
            setDot4Y( dot4y + (gestureState.dy / 8))
        },
        moveThreshold: 1, // Adjust this value as needed
    });
    {/* Draggable Functions */}

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
                    <FontAwesome5 name="arrow-left" size={30} color="#FFB2E6" />
                </TouchableOpacity>

                { editing ? 
                    (
                        <TouchableOpacity style={styles.backButton} onPress={() => saveOutline()}>
                            <FontAwesome5 name="save" size={30} color="#FFB2E6" />
                        </TouchableOpacity>
                    )
                    :
                    (
                        <TouchableOpacity style={styles.backButton} onPress={() => editOutline()}>
                            <FontAwesome5 name="edit" size={30} color="#FFB2E6" />
                        </TouchableOpacity>
                        )
                }
            </View>

            <View style={styles.main} ref={viewRef} options={{format: 'jpg', quality: 0.9}}>
                <Svg viewBox={`0 0 ${(boardWid + 2)} ${boardLen + 2}`} style={styles.svg}>

                    {/* Lines */}
                    { editing ?
                        (                    
                            <>
                                <Line 
                                    x1={widePointLeft}
                                    y1={widePointY} 
                                    x2={widePointRight}
                                    y2={widePointY} 
                                    stroke="#FFB2E6" 
                                    strokeWidth="1" 
                                    strokeOpacity={0.5}
                                />
                                <Line 
                                    x1={nosailX} 
                                    y1={noseY} 
                                    x2={nosailX} 
                                    y2={tailY}
                                    stroke="#FFB2E6" 
                                    strokeWidth="1" 
                                    strokeOpacity={0.5}
                                />
                                {/* Dashed Lines */}
                                <Line
                                    x1={nosailX} 
                                    y1={noseY} 
                                    x2={dot6x} 
                                    y2={dot6y}
                                    stroke="green" // Color of the line
                                    strokeWidth="0.5" // Width of the line
                                    strokeDasharray="1 1"
                                />
                                <Line
                                    x1={nosailX} 
                                    y1={tailY} 
                                    x2={dot3x} 
                                    y2={dot3y}
                                    stroke="green" // Color of the line
                                    strokeWidth="0.5" // Width of the line
                                    strokeDasharray="1 1"
                                />
                                <Line
                                    x1={nosailX} 
                                    y1={tailY} 
                                    x2={dot5x} 
                                    y2={dot5y}
                                    stroke="green" // Color of the line
                                    strokeWidth="0.5" // Width of the line
                                    strokeDasharray="1 1"
                                />

                                {/* Nose and Tail Measurement lines */}
                                <Line
                                    x1={noseXLeft}
                                    y1={13}
                                    x2={noseXRight}
                                    y2={13}
                                    stroke="#FFB2E6"
                                    strokeWidth="1"
                                    strokeOpacity={0.5}
                                />
                                <Line
                                    x1={tailXLeft} 
                                    y1={tailY-12} 
                                    x2={tailXRight} 
                                    y2={tailY-12}
                                    stroke="#FFB2E6" // Color of the line
                                    strokeWidth="1" // Width of the line
                                    strokeOpacity={0.5}
                                />

                                { (tail == 'Moon' || tail == 'Diamond' || tail == 'Swallow' || tail == 'Fish') 
                                    ? 
                                    (                    
                                    <Line
                                        x1={nosailX} 
                                        y1={moonCurveY} 
                                        x2={dot4x} 
                                        y2={dot4y}
                                        stroke="green" // Color of the line
                                        strokeWidth="0.5" // Width of the line
                                        strokeDasharray="1 1"                        
                                    />  
                                    ) 
                                    : 
                                    (<></>)
                                }
                            </>
                        )
                        :
                        (<></>)
                    }                  

                    {/* Nose Paths */}
                    <Path
                        d={`M${widePointRight},${widePointY} C${r1x},${r1y} ${r2x},${r2y} ${nosailX},${noseY}`}
                        fill="none"
                        stroke={lineColor} 
                        strokeWidth={lineWidth}
                    />

                    <Path
                        d={`M${widePointLeft},${widePointY} C${l1x},${l1y} ${l2x},${l2y} ${nosailX},${noseY}`}
                        fill="none"
                        stroke={lineColor} 
                        strokeWidth={lineWidth}
                    />

                    {/* Tail Paths */}
                    {
                        (() => {
                            switch (tail) {
                            case "Fish":
                                return (
                                    <>
                                        <Path
                                            d={`M${widePointLeft},${widePointY-0.2} Q${path3X},${path3Y} ${fishPathX1},${fishPathY1}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth}
                                        />
                                        <Path
                                            d={`M${widePointRight},${widePointY-0.2} Q${path4X},${path4Y} ${fishPathX2},${fishPathY2}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth} 
                                        />
                                        <Path
                                            d={`M${fishPathX3},${fishPathY3} Q${fishCurveX1},${fishCurveY1} ${fishPathX1},${fishPathY1}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth}                                         
                                        />
                                        <Path
                                            d={`M${fishPathX3},${fishPathY3} Q${fishCurveX2},${fishCurveY2} ${fishPathX2},${fishPathY2}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth}                                         
                                        />
                                    </>
                                );
                            case "Swallow":
                                return (
                                    <>
                                        <Path
                                            d={`M${widePointLeft},${widePointY} Q${path3X},${path3Y} ${swallowLineX1+0.2},${swallowLineY1}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth} 
                                        />
                                        <Line
                                            x1={swallowLineX1}
                                            y1={swallowLineY1} 
                                            x2={swallowLineX3}
                                            y2={swallowLineY3} 
                                            stroke={lineColor} 
                                            strokeWidth={lineWidth}                                     
                                        />
                                        <Line
                                            x1={swallowLineX2}
                                            y1={swallowLineY2} 
                                            x2={swallowLineX3}
                                            y2={swallowLineY3}  
                                            stroke={lineColor} 
                                            strokeWidth={lineWidth}                        
                                        />
                                        <Path
                                            d={`M${widePointRight},${widePointY} Q${path4X},${path4Y} ${swallowLineX2-0.2},${swallowLineY2}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth}
                                        />
                                    </>
                                );
                            case "Moon":
                                return (
                                    <>
                                        <Path
                                            d={`M${widePointLeft},${widePointY} Q${path3X},${path3Y} ${moonLineX1+0.1},${moonLineY1}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth}
                                        />
                                        <Path
                                            d={`M${widePointRight},${widePointY} Q${path4X},${path4Y} ${moonLineX2-0.1},${moonLineY2}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth} 
                                        />
                                        <Path
                                            d={`M${moonLineX1},${moonLineY1} Q${moonCurveX},${moonCurveY} ${moonLineX2},${moonLineY2}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth}                                          
                                        />
                                    </>
                                );
                            case "Standard":
                                return (
                                    <>
                                        <Path
                                            d={`M${widePointLeft},${widePointY} Q${path3X},${path3Y} ${standardLineX1+0.2},${standardLineY1}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth} 
                                        />
                                        <Line
                                            x1={standardLineX1} // Left
                                            y1={standardLineY1}
                                            x2={standardLineX2} // Right
                                            y2={standardLineY2}
                                            stroke={lineColor}
                                            strokeWidth={lineWidth}
                                        />
                                        <Path
                                            d={`M${widePointRight},${widePointY} Q${path4X},${path4Y} ${standardLineX2-0.2},${standardLineY2}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth} 
                                        />
                                    </>
                                );
                            case "Diamond":
                                return (
                                    <>
                                        <Path
                                            d={`M${widePointLeft},${widePointY} Q${path3X},${path3Y} ${diamondLineX1},${diamondLineY1}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth} 
                                        />
                                        <Line
                                            x1={diamondLineX1}
                                            y1={diamondLineY1} 
                                            x2={diamondLineX3}
                                            y2={diamondLineY3} 
                                            stroke={lineColor} 
                                            strokeWidth={lineWidth}                                     
                                        />
                                        <Line
                                            x1={diamondLineX2}
                                            y1={diamondLineY2} 
                                            x2={diamondLineX3}
                                            y2={diamondLineY3}  
                                            stroke={lineColor} 
                                            strokeWidth={lineWidth}                         
                                        />
                                        <Path
                                            d={`M${widePointRight},${widePointY} Q${path4X},${path4Y} ${diamondLineX2},${diamondLineY2}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth} 
                                        />                                        
                                    </>
                                    
                                );
                            default:
                                return (
                                    <>
                                        <Path
                                            d={`M${widePointLeft},${widePointY} Q${path3X},${path3Y} ${nosailX},${tailY}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth} 
                                        />
                                        <Path
                                            d={`M${widePointRight},${widePointY} Q${path4X},${path4Y} ${nosailX},${tailY}`}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth={lineWidth} 
                                        />
                                    </>
                                );
                            }
                        })()
                    }

                    { editing ?
                        (
                            <>
                                {/* Nose Dot */}
                                <Circle
                                    cx={nosailX}
                                    cy={noseY}
                                    r="1"
                                    fill="green"
                                />
                                {/* Wide Point Dots */}
                                <Circle
                                    cx={widePointLeft}
                                    cy={widePointY}
                                    r="1"
                                    fill="green"
                                    {...PanResponderWidePoint.panHandlers}
                                />
                                <Circle
                                    cx={widePointRight}
                                    cy={widePointY}
                                    r="1"
                                    fill="green"
                                    {...PanResponderWidePoint.panHandlers}
                                />
                                {/* Tail Dot */}
                                <Circle
                                    cx={nosailX}
                                    cy={tailY}
                                    r="1"
                                    fill="green"
                                />

                                {/* Control dots */}
                                <Circle
                                    cx={dot3x}
                                    cy={dot3y}
                                    r={radius}
                                    fill="lightblue"
                                    {...PanResponderTail.panHandlers}
                                />
                                <Circle
                                    cx={dot5x}
                                    cy={dot5y}
                                    r={radius}
                                    fill="green"
                                    {...PanResponderTailRail.panHandlers}
                                />
                                <Circle
                                    cx={dot6x}
                                    cy={dot6y}
                                    r={radius}
                                    fill="green"
                                    {...PanResponderNoseRail.panHandlers}
                                />

                                {(tail == 'Moon' || tail == 'Diamond' || tail == 'Swallow' || tail == 'Fish') 
                                    ? 
                                    (                    
                                        <Circle
                                            cx={dot4x}
                                            cy={dot4y}
                                            r={radius}
                                            fill="lightblue"
                                            {...PanResponderMoonY.panHandlers}                            
                                        />
                                    ) 
                                    : 
                                    (<></>)
                                }
                            </>
                        )
                        :
                        (<></>)
                    }

                </Svg>
            </View>

            <View style={styles.footer}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.footerText}>W: {boardWid}" @ {(boardLen-widePointY).toFixed(2)}"</Text>
                    <Text style={styles.footerText}>L: {boardLen}"</Text>
                    <Text style={styles.footerText}>N: {(noseXRight - noseXLeft).toFixed(2)}"</Text>
                    <Text style={styles.footerText}>T: {(tailXRight - tailXLeft).toFixed(2)}"</Text>
                </View>

                <TouchableOpacity onPress={() => handlePrint()}>
                    <FontAwesome5 name="print" size={30} color="#FFB2E6" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C363F',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 20,
        top: 20,
        zIndex: 1,
        marginTop: 30,
    },
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Optional: align content in the center
    },
    footer: {
        flex: 0.1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center', // Optional: align content in the center
        zIndex: 1,
        marginHorizontal: 20,
        paddingBottom: 10,
    },
    footerText: {
        color: '#FFB2E6',
        textAlign: 'left',
        fontSize: 12,
    },
    svg: {
        zIndex: 0,
        marginTop: 30,
        backgroundColor: '#2C363F',
    },
});

export default Design;