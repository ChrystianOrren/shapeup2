import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, ScrollView } from 'react-native';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path, Line } from 'react-native-svg';

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

// Remove data from storage
const removeData = async (key) => {
  try {
    await storage.remove({
      key: key,
    });
    console.log('Data removed successfully');
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

// Load data from database
const loadAllData = async () => {
  try {
    // Retrieve all keys from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();

    // Use Promise.all() to get the values for all keys
    const data = await Promise.all(keys.map(async (key) => {
      // Retrieve the value for each key
      const value = await AsyncStorage.getItem(key);

      // Check if the value is valid JSON
      if (value && value.startsWith('{') && value.endsWith('}')) {
        try {
          const parsedValue = JSON.parse(value);
          //console.log(`Parsed value for key ${key}:`, parsedValue); // Log the parsed value
          return { key, value: parsedValue };
        } catch (parseError) {
          console.error(`Error parsing value for key ${key}:`, parseError); // Log the parsing error
          return null;
        }
      } else {
        // Skip invalid JSON values
        //console.warn(`Skipping value for key ${key}: Invalid JSON`);
        return null;
      }
    }));

    // Filter out null values
    const filteredData = data.filter(item => item !== null);
    return filteredData;
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
};

// Parse loaded data
const parseData = async () => {
  try {
    const data = await loadAllData();
    const formattedData = data.map(item => {
      // Extracting values
      const name = item.key;
      const rawData = JSON.parse(item.value.rawData);
      const { lengFt, lenIn, widIn, tail } = rawData;
      let formattedArray;

      switch(rawData.tail){
        case "Swallow":
          {
            const { widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, swallowLineX1, swallowLineY1, swallowLineX2, swallowLineY2, swallowLineX3, swallowLineY3 } = rawData;
            formattedArray = [lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, swallowLineX1, swallowLineY1, swallowLineX2, swallowLineY2, swallowLineX3, swallowLineY3];
          }
          break;
        case "Fish":
          {
            const { widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, fishPathX1, fishPathY1, fishPathX2, fishPathY2, fishPathX3, fishPathY3, fishCurveX1, fishCurveY1, fishCurveX2, fishCurveY2 } = rawData;
            formattedArray = [lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, fishPathX1, fishPathY1, fishPathX2, fishPathY2, fishPathX3, fishPathY3, fishCurveX1, fishCurveY1, fishCurveX2, fishCurveY2];
          }//                  1        2      3     4         5         6     7        8        9     10   11  12   13   14   15    16   17   18           19           20         21             22        23           24          25             26           27             
          break;
        case "Diamond":
          {
            const { widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, diamondLineX1, diamondLineY1, diamondLineX2, diamondLineY2, diamondLineX3, diamondLineY3 } = rawData;
            formattedArray = [lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, diamondLineX1, diamondLineY1, diamondLineX2, diamondLineY2, diamondLineX3, diamondLineY3];
          }
          break;
        case "Moon":
          {
            const { widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, moonLineX1, moonLineY1, moonLineX2, moonLineY2, moonCurveX, moonCurveY } = rawData;
            formattedArray = [lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, moonLineX1, moonLineY1, moonLineX2, moonLineY2, moonCurveX, moonCurveY];
          }
          break;
        case "Standard":
          {
            const { widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, standardLineX1, standardLineY1, standardLineX2, standardLineY2 } = rawData;
            formattedArray = [lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y, standardLineX1, standardLineY1, standardLineX2, standardLineY2];
          }
          break;
        default: // Pin
          {
            const { widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y } = rawData;
            formattedArray = [lengFt, lenIn, widIn, tail, widePointY, path3X, path3Y, path4X, path4Y, r1x, r1y, r2x, r2y, l1x, l1y, l2x, l2y];
          }
          break;
      }

      // Returning formatted array
      return[name, ...formattedArray];
    });

    return formattedData; // Return the formatted data
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array in case of error
  }
}

// Clear all data for testing puprposes
const clearAllData = async () => {
  try {
    // Retrieve all keys from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();

    // Use Promise.all() to remove all values for all keys
    await Promise.all(keys.map(async (key) => {
      // Remove the value for each key
      await AsyncStorage.removeItem(key);
    }));

    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

const Dashboard = () => {
  {/* Run When App Mounts */}
  useEffect(() => {
      //clearAllData();
      getBoards();
  }, []);

  {/* Navigation */}
  const navigation = useNavigation();

  {/* Use States */}
  const [boards, setBoards] = useState([]);
  const lineColor = "#FFB2E6";

  {/* Functions */}
  // Takes parsed data and sets boards
  const getBoards = async () => {
    const parsed = await parseData();
    console.log("here: ", parsed);
    setBoards(parsed);
  };

  // Sets modal to visible 
  const handleAddNewBoard = () => {
    navigation.navigate('CreateBoard');
  };

  // Pull data again
  const refreshBoards = () => {
    getBoards();
  }

  const settings = () => {
    navigation.navigate('Settings');
  }

  const pressedBoard = (board) => {
    console.log(board);
    navigation.navigate('Design', { data: board });
  }

  const deleteBoard = async (key) => {
    removeData(key);
    getBoards();
  }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.settings} onPress={() => settings()}>
                  <FontAwesome5 name="cog" size={30} color="#FFB2E6"/>
                </TouchableOpacity>

                <Text style={styles.headerText}>ShapeUp</Text>

                <TouchableOpacity style={styles.refresh} onPress={() => refreshBoards()}>
                    <FontAwesome5 name="sync-alt" size={30} color="#FFB2E6"/>
                </TouchableOpacity>

            </View>

            {/* Body */}
            <ScrollView contentContainerStyle={styles.body}>
                {boards.map((board, index) => (
                    <TouchableOpacity key={index} style={styles.boardItem} onPress={() => pressedBoard(board)}>
                      <Svg style={styles.boardSvg} viewBox={`1 1 ${(parseFloat(board[3]) + 2)} ${((parseFloat(board[1]) * 12) + parseFloat(board[2]) + 2)}`}>
                        {/* Nose Paths */}
                        <Path
                            d={`M${(parseFloat(board[3]) + 2)-1},${board[5]} C${board[10]},${board[11]} ${board[12]},${board[13]} ${(parseFloat(board[3]) + 2) / 2},${1}`}
                            fill="none"
                            stroke={lineColor} 
                            strokeWidth={board[1]/5}
                        />
                        <Path
                            d={`M${1},${board[5]} C${board[14]},${board[15]} ${board[16]},${board[17]} ${(parseFloat(board[3]) + 2) / 2},${1}`}
                            fill="none"
                            stroke={lineColor} 
                            strokeWidth={board[1]/5}
                        />
                        {/* Tail Paths */}
                        {
                            (() => {
                                switch (board[4]) {
                                case "Fish":
                                    return (
                                        <>
                                            <Path
                                                d={`M${1},${board[5]-0.2} Q${board[6]},${board[7]} ${board[18]},${board[19]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5}
                                            />
                                            <Path
                                                d={`M${(parseFloat(board[3]) + 2)-1},${board[5]-0.2} Q${board[8]},${board[9]} ${board[20]},${board[21]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5} 
                                            />
                                            <Path
                                                d={`M${board[22]-0.1},${board[23]} Q${board[24]},${board[25]} ${board[18]},${board[19]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5}                                         
                                            />
                                            <Path
                                                d={`M${board[22]+0.1},${board[23]} Q${board[26]},${board[27]} ${board[20]},${board[21]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5}                                         
                                            />
                                        </>
                                    );
                                case "Swallow":
                                    return (
                                        <>
                                            <Path
                                                d={`M${1},${board[5]} Q${board[6]},${board[7]} ${board[18]+0.2},${board[19]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5} 
                                            />
                                            <Line
                                                x1={board[18]}
                                                y1={board[19]} 
                                                x2={board[22]}
                                                y2={board[23]} 
                                                stroke={lineColor} 
                                                strokeWidth={board[1]/5}                                     
                                            />
                                            <Line
                                                x1={board[20]}
                                                y1={board[21]} 
                                                x2={board[22]}
                                                y2={board[23]}  
                                                stroke={lineColor} 
                                                strokeWidth={board[1]/5}                        
                                            />
                                            <Path
                                                d={`M${(parseFloat(board[3]) + 2)-1},${board[5]} Q${board[8]},${board[9]} ${board[20]-0.2},${board[21]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5}
                                            />
                                        </>
                                    );
                                case "Moon":
                                    return (
                                        <>
                                            <Path
                                                d={`M${1},${board[5]} Q${board[6]},${board[7]} ${board[18]+0.1},${board[19]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5}
                                            />
                                            <Path
                                                d={`M${(parseFloat(board[3]) + 2)-1},${board[5]} Q${board[8]},${board[9]} ${board[20]-0.1},${board[21]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5} 
                                            />
                                            <Path
                                                d={`M${board[18]},${board[19]} Q${board[22]},${board[23]} ${board[20]},${board[21]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5}                                          
                                            />
                                        </>
                                    );
                                case "Standard":
                                    return (
                                        <>
                                            <Path
                                                d={`M${1},${board[5]} Q${board[6]},${board[7]} ${board[18]+0.2},${board[19]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5} 
                                            />
                                            <Line
                                                x1={board[18]} // Left
                                                y1={board[19]}
                                                x2={board[20]} // Right
                                                y2={board[21]}
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5}
                                            />
                                            <Path
                                                d={`M${(parseFloat(board[3]) + 2)-1},${board[5]} Q${board[8]},${board[9]} ${board[20]-0.2},${board[21]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5} 
                                            />
                                        </>
                                    );
                                case "Diamond":
                                    return (
                                        <>
                                            <Path
                                                d={`M${1},${board[5]} Q${board[6]},${board[7]} ${board[18]},${board[19]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5} 
                                            />
                                            <Line
                                                x1={board[18]}
                                                y1={board[19]} 
                                                x2={board[22]}
                                                y2={board[23]} 
                                                stroke={lineColor} 
                                                strokeWidth={board[1]/5}                                     
                                            />
                                            <Line
                                                x1={board[20]}
                                                y1={board[21]} 
                                                x2={board[22]}
                                                y2={board[23]}  
                                                stroke={lineColor} 
                                                strokeWidth={board[1]/5}                         
                                            />
                                            <Path
                                                d={`M${(parseFloat(board[3]) + 2)-1},${board[5]} Q${board[8]},${board[9]} ${board[20]},${board[21]}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5} 
                                            />                                        
                                        </>
                                        
                                    );
                                default:
                                    return (
                                        <>
                                            <Path
                                                d={`M${1},${board[5]} Q${board[6]},${board[7]} ${((parseFloat(board[3]) + 2) / 2)+0.15},${((parseFloat(board[1]) * 12) + parseFloat(board[2]))-1}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5} 
                                            />
                                            <Path
                                                d={`M${(parseFloat(board[3]) + 2)-1},${board[5]} Q${board[8]},${board[9]} ${((parseFloat(board[3]) + 2) / 2)-0.15},${((parseFloat(board[1]) * 12) + parseFloat(board[2]))-1}`}
                                                fill="none"
                                                stroke={lineColor}
                                                strokeWidth={board[1]/5} 
                                            />
                                        </>
                                    );
                                }
                            })()
                        }
                      </Svg>
                      <View style={styles.boardInfo}>
                        <Text style={styles.boardItemName} >{board[0]}</Text>
                        <Text style={styles.boardItemText} >{board[1]}'{board[2]}" x {board[3]}"</Text>
                        <Text style={styles.boardItemText} >{board[4]}</Text>
                      </View>
                      <TouchableOpacity onPress={() => deleteBoard(board[0])}>
                        <FontAwesome5 name="trash" size={30} color="#FFB2E6"/>
                      </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => handleAddNewBoard()} style={styles.addButton}>
                    {/* <Icon name="plus" size={40} color="black" /> */}
                    <Text style={styles.addNewText}>Create New Board</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

{/* Main Styles */}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      height: 120,
      backgroundColor: '#2C363F',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
      flexDirection: 'row'
    },
    headerText: {
      fontSize: 50,
      fontFamily: 'Super Dream',
      paddingTop: 30,
      color: '#FFB2E6',
    },
    footer: { 
      height: 100,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: '#2C363F',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    addButton: {
      backgroundColor: '#FFB2E6',
      alignSelf: 'center',
      padding: 15,
      borderRadius: 30,
      marginBottom: 10,
      elevation: 5,
      width: '90%',
      height: '55%',
    },
    addNewText: {
      textAlign: 'center',
      fontFamily: 'ShareTech-Regular',
      fontSize: 25,
    },  
    refresh: {
      position: 'absolute',
      right: 40,
      top: 70,
    },
    settings: {
      position: 'absolute',
      left: 40,
      top: 70,
    },
    body: {
      flexGrow: 1,
      paddingVertical: 20,
      paddingHorizontal: 10,
      backgroundColor: '#2C363F',
      paddingRight: 30,
    },
    boardItem: {
      padding: 10,
      borderWidth: 2,
      borderRadius: 20,
      borderColor: '#FFB2E6',
      margin: 10,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',  // Ensure it takes full width
    },
    boardSvg: {
      width: 100,  // Adjust width to fit SVG
      height: 100, // Adjust height to fit SVG
    },
    boardInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    boardItemName: {
      fontFamily: 'ShareTech-Regular',
      color: '#FFB2E6',
      fontSize: 30,  // Adjust font size for better fit
    },
    boardItemText: {
      fontFamily: 'ShareTech-Regular',
      color: '#FFB2E6',
      fontSize: 20,  // Adjust font size for better fit
    },
    deleteButton: {
      paddingHorizontal: 10,
    }
    
});

export default Dashboard;