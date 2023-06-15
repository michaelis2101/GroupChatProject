
import React, { useState } from 'react';
import { View, TextInput, Button, ToastAndroid, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import uuid from 'react-native-uuid';

import { useAuth } from './authcontext';



const CreateGroup = ({navigation}) =>{

    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);  
    const {idUser} = useAuth()

    const handleSelectMembers = (members) => {
        setSelectedMembers(members);
    };

    const cancelHandler = () => {
        setSelectedMembers([])
    }


    const handleCreateGroup = () => {
    if (groupName.length === 0 || selectedMembers.length === 0) {
        ToastAndroid.show('Nama Grup Atau Anggota Kosong', ToastAndroid.SHORT);
        return;
    } else {
        const randomId = uuid.v4();

        // get data dari firebase dimana userId == idUser
        const userRef = firebase.firestore().collection('users').where('userId', '==', idUser);
            userRef
            .get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();

                // nambah logged-in user ke selectedMembers
                const updatedMembers = [...selectedMembers, userData];

                // Insert data ke Firestore
                const roomRef = firebase.firestore().collection('rooms');
                roomRef
                    .add({
                        groupName: groupName,
                        members: updatedMembers,
                        roomId: randomId,
                    })
                    .then(() => {
                        console.log(updatedMembers);
                        console.log(groupName);
                        navigation.goBack();
                    })
                    .catch((error) => {
                        console.log('Error creating group:', error);
                    });
                }
            })
            .catch((error) => {
                console.log('Error fetching user data:', error);
            });
        }
    };



    // const handleCreateGroup = () => {

    //     if (groupName.length == 0||selectedMembers.length==0) {
    //         ToastAndroid.show('Nama Grup Atau Anggota Kosong', ToastAndroid.SHORT);
    //         return;
    //     }else{
    //         // Generate random roomId
    //         const randomId = uuid.v4();
    //         console.log(randomId);

            
    //         //insert data ke firestore
    //         const roomRef = firebase.firestore().collection('rooms');
    //         roomRef.add({
    //             groupName: groupName,
    //             members: selectedMembers,
    //             roomId: randomId
    //         });
    //         console.log(selectedMembers)
    //         console.log(groupName)
    //         navigation.goBack()
    //     }
        
    // };

    return (
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

                <Text style={styles.fontstyle}>Create Group</Text>
            </View>

            <TextInput
                value={groupName}
                onChangeText={text => setGroupName(text)}
                placeholder="Enter group name"
                placeholderTextColor="#808080"
                style={styles.input}
            />


            {selectedMembers.length > 0 && (
                <View>
                    <View style={styles.selectedmembercon}>
                        {selectedMembers.map((member, index) => (
                            <View style={styles.membercontainer} key={index}>
                                <View style={styles.conlogocontainer}>
                                    <Image source={require('../assets/half-person.png')} style={styles.conlogo}/>
                                </View>
                                <Text style={styles.membertext}>{member.username}</Text>
                            </View> 
                        ))}
                    </View>
                    
                </View>
            )}



            {selectedMembers.length === 0 ? (
                <TouchableOpacity 
                    style={styles.addbutton}
                    onPress={()=> navigation.navigate('SelectMember', {
                        onSelectMembers: handleSelectMembers
                    })
                    }>
                        <Text style={styles.textbtn}>Add Members</Text>
                </TouchableOpacity>
            ):(
                <TouchableOpacity onPress={cancelHandler} style={styles.addbutton}>
                    <Text style={styles.textbtn}>Cancel Selection</Text>
                </TouchableOpacity>
            )}

            

            

            <TouchableOpacity style={styles.addbutton} onPress={handleCreateGroup}>
                <Text style={styles.textbtn}>Create Group</Text>
            </TouchableOpacity>
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    container :{
        flex: 1,
        backgroundColor: '#f9f9f9'
    },

    addbutton:{
        backgroundColor:'#6F8BED',
        alignItems:'center',
        borderRadius:10,
        marginHorizontal: 30,
        marginVertical:5
    },

    textbtn:{
        marginVertical:10,
        color:'#fff',
        fontSize:16
    },

    input: {
    backgroundColor:'#DDDDDD',
    color:'#000',
    marginVertical:10,
    marginHorizontal:30,
    borderRadius:10
    },

    cancelbtn:{
        color:'#000'
    },

    selectedmembercon:{
        flexDirection:'row',
        marginHorizontal: 30
    },

    conlogocontainer:{
        backgroundColor:'#6F8BED',
        borderWidth:1,
        borderColor:'#6F8BED',
        borderRadius:30,
        padding:5
    },

    conlogo:{
        width: 40,
        height: 40,
        resizeMode:'contain'
    },

    membercontainer: {
        //flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10

    },

    membertext:{
        color:'#333333',
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

export default CreateGroup;