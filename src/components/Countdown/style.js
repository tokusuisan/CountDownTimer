import { StyleSheet } from 'react-native';

const selectTimeStyles = StyleSheet.create({
    container: {
      marginTop: 20,
      flex:1
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginBottom: 20,
    },
    pickerContainer: {
      alignItems: 'center',
    },
    pickerText: {
      fontSize: 16,
      marginBottom: 5,
      fontFamily: 'Roboto-Bold',
    },
    pickerKoron: {
      fontSize: 20,
      marginBottom: 20,
      fontFamily: 'Roboto-Bold',
    },
    button: {
      marginTop: 20,
      marginBottom: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 10,
    },
    //SwipeListView styles
    swipeItem: {
      alignItems: 'center',
      backgroundColor: 'white',
      borderBottomColor: 'black',
      borderBottomWidth: 1,
      justifyContent: 'center',
      height: 50,
    },
    deleteButtonContainer:{
     alignItems: 'center', 
     backgroundColor: '#DDD',
     flex: 1,
     flexDirection: 'row', 
     justifyContent: 'space-between', 
     paddingLeft: 15 
    },
    deleteButton: {
      alignItems: 'center',
      bottom: 0,
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      width: 75,
      backgroundColor: 'red',
      right: 0,
    },
    deleteText: {
      color: 'white',
    },
    //SelectDropdown styles
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
    },
    dropdownButtonStyle: {
     width: 50,
     height: 50,
     backgroundColor: '#E9ECEF',
     borderRadius: 12,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
     flex: 1,
     fontSize: 18,
     fontWeight: '500',
     color: '#151E26' 
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1  
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26'   
    }
  });
  
  const timeRemainingStyles = StyleSheet.create({
    container: {
      flex:1,
      marginTop: 20,
      alignItems: 'center',
    },
    timeText: {
      fontSize: 60,
      fontFamily: 'Roboto-Bold',
      textAlign: 'center',
      alignItems: 'center' 
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    button: {
      marginRight: '10%',
    },
    timeUpText: {
      textAlign: 'center',
      fontSize: 18,
      marginTop: 20,
    },
  });
   
  export {timeRemainingStyles, selectTimeStyles}