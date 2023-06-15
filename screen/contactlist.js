import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { useRoute } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import { useAuth } from './authcontext';

const ConList=({navigation})=>{

    const [User, setUser] = useState([]);
    const {idUser} = useAuth()


    useEffect(() => {
    
    const getUserList = firebase
        .firestore()
        .collection('users')
        .onSnapshot(userSnapHandler);

      function userSnapHandler(snapshot){
        const usersList = [];
        snapshot.forEach(doc => {
            const { userId,username } = doc.data();
                if(userId!=idUser){
                    usersList.push({
                    id: doc.id,
                    userId,
                    username,
                });
            }
        });
        setUser(usersList);
      }

    return () => getUserList();
    }, []);

    // useEffect(() => {
    
    // const getUserList = firebase
    //     .firestore()
    //     .collection('users')
    //     .onSnapshot(userSnapHandler);

    //   function userSnapHandler(snapshot){
    //     const usersList = [];
        
    //     snapshot.forEach(doc => {
    //         const { userId,username } = doc.data();
    //         usersList.push({
    //             id: doc.id,
    //             userId,
    //             username,
    //         });
    //     });
    //     setUser(usersList);
    //   }

    // return () => getUserList();
    // }, []);

    const handleUserPress = (username, userId) => {
    
        navigation.navigate('ChatScreen', { username, userId });
    };

    const renderUserItem = ({ item }) => (
        <View>
            <TouchableOpacity onPress={() => handleUserPress(item.username, item.userId)} style={styles.conlist}>
                <View style={styles.conlogocontainer}>
                    <Image source={require('../assets/half-person.png')} style={styles.conlogo}/>
                </View>
                <Text style={styles.listtext}>{item.username}</Text>
            </TouchableOpacity>
        </View>
    );

    
    




    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={()=> navigation.goBack()}
                    style={styles.backbutton}
                >
                    <Image
                        source={require('../assets/arrowleft.png')}
                        //source={require('./assets/svg/arrowleft.svg')}
                        style={styles.backbutton}
                    />
                </TouchableOpacity>

                <Text style={styles.fontstyle}>Contact List</Text>
            </View>

            <FlatList
                data={User}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
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

    conlist:{
        borderWidth:1,
        paddingHorizontal:10,
        paddingVertical:10,
        flexDirection:'row',
        marginBottom:1,
        borderColor:'#BABABA'
    },

    conlogo:{
        width: 40,
        height: 40,
        resizeMode:'contain'
    },

    conlogocontainer:{
        backgroundColor:'#6F8BED',
        borderWidth:1,
        borderColor:'#6F8BED',
        borderRadius:30,
        padding:5
    },

    header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    },

    fontstyle:{
    justifyContent:'center',
    alignItems:'center',
    marginLeft:6,
    fontSize:16,
    //marginVertical:5,
    fontFamily:'Poppins-Regular',
    marginTop:5,
    marginBottom:5,
    color:'#19192C'
    },

    backbutton:{
    marginLeft:4,
    marginRight:10,
    //marginVertical:10,
    marginTop:5,
    marginBottom:5
    },




})

export default ConList;