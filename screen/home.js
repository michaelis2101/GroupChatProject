import { useState,useEffect } from 'react'
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid, Alert, BackHandler } from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'


import { useAuth } from './authcontext';

const HomeScreen = ({navigation}) => {
    const isFocused = useIsFocused();
    
    const {idUser} = useAuth()
    const {logout} = useAuth()
    

     const [Room,setRoom] = useState([])
     const [refreshing, setRefreshing] = useState(false);

     console.log(idUser)

     const logoutHandler = () =>{
        logout(()=>{
            console.log('logout ss')
            navigation.navigate('LoginScreen')
        })
     }

     useEffect(() => {
        if (idUser) {
            const getRoomList = firebase
            .firestore()
            .collection('rooms')
            .onSnapshot(roomSnapHandler);

            function roomSnapHandler(snapshot) {
            const roomList = [];
            snapshot.forEach((doc) => {
                const { groupName, members, roomId } = doc.data();
                // buat ngecek apakah iduser yang login ada di array members
                const isMember = members.some((member) => member.userId === idUser);
                console.log(isMember);
                if (isMember) {
                roomList.push({
                    id: doc.id,
                    groupName,
                    members,
                    roomId,
                });
                }
            });
            setRoom(roomList);
            }
            return () => getRoomList();
        }
    }, [idUser]);


    useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Logout',
              onPress: logoutHandler,
            },
          ],
          { cancelable: false }
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
    }, [isFocused]);


     const groupChatNavigateHandler = (groupName, members, roomId) => {
        navigation.navigate('GroupChatScreen', {groupName, members, roomId})
     }

     

    const renderRoomList = ({ item }) => (
        <View>
            <TouchableOpacity onPress={()=>groupChatNavigateHandler(item.groupName , item.members, item.roomId)} style={styles.grouplist}>
                <View style={styles.grouplogocontainer}>
                    <Image source={require('../assets/group-wh.png')} style={styles.grouplogo}/>
                </View>
                <Text style={styles.listtext}>{item.groupName}</Text>
            </TouchableOpacity>
        </View>
        
    );



    return(
        <View style={styles.container}>
            
            <FlatList
                data={Room}
                renderItem={renderRoomList}
                keyExtractor={(item)=>item.id}
            />


            <View style={styles.fabcontainerc}>
                <TouchableOpacity style={styles.fab} onPress={()=> navigation.navigate('ContactList')}>
                    <Image source={require('../assets/bmwhite.png')} style={styles.contactlist}/>
                </TouchableOpacity>
            </View>

            <View style={styles.fabcontainerg}>
                <TouchableOpacity style={styles.fab} onPress={()=> navigation.navigate('CreateGroup')}>
                    <Image source={require('../assets/add-group.png')} style={styles.plusbtn}/>
                </TouchableOpacity>
            </View>
            
            {/* <TouchableOpacity 
                onPress={logoutHandler}
                style={styles.logoutbtn}>
                    <Text style={{color:'#f9f9f9'}}>logout</Text>
            </TouchableOpacity> */}

        </View>
    )


}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },

    fabcontainerg: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },

    fabcontainerc:{
        position: 'absolute',
        bottom: 80,
        right: 16,
    },

    fab:{
        backgroundColor: '#6F8BED',
        borderRadius: 15,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },

    plusbtn:{
        width: 24, 
        height: 24, 
        resizeMode: 'contain',
    },

    contactlist:{
        width: 40, 
        height: 40,
        resizeMode: 'contain', 
    },

    listtext:{
        color:'#000',
        justifyContent: 'center',
        alignItems: 'center',
        //paddingTop:15,
        paddingVertical:8,
        paddingHorizontal:7.5,
        fontSize:20
    },

    grouplist:{
        borderWidth:1,
        paddingHorizontal:10,
        paddingVertical:10,
        flexDirection:'row',
        marginBottom:1,
        borderColor:'#BABABA'
    },

    grouplogo:{
        width: 40,
        height: 40,
        resizeMode:'contain'
    },

    grouplogocontainer:{
        backgroundColor:'#6F8BED',
        borderWidth:1,
        borderColor:'#6F8BED',
        borderRadius:30,
        padding:5
    },

    logoutbtn:{
        backgroundColor:'#6F8BED',
        width: 60,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        paddingVertical:10,
        position:'absolute',
        bottom:16,
        left:16
    }

})

export default HomeScreen;