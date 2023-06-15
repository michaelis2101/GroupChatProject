import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { useRoute } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import CheckBox from '@react-native-community/checkbox';

import { useAuth } from './authcontext';




const SelectMember = ({navigation}) => {

    const route = useRoute();

    const {idUser} = useAuth()

    const [members, setMembers] = useState([]);
    //const [id_sender, setId_Sender] = useState('234');

    

    useEffect(() => {

        const fetchUserList = firebase
            .firestore()
            .collection('users')
            .onSnapshot(userFetchHandler);


        function userFetchHandler(snapshot) {
            const userList = [];

            snapshot.forEach(doc => {
                const { userId,username } = doc.data();
                if (userId != idUser){
                    userList.push({
                        id:doc.id,
                        userId,
                        username
                    });
                }
            });
            setMembers(userList);
        }
        
        return () => {
            fetchUserList();
        };

    },[]);

    const toggleMemberSelection = (userId) => {
        setMembers(prevUsers =>
            prevUsers.map(user => {
                if (user.id === userId) {
                return { ...user, selected: !user.selected };
                }
                return user;
            })
        );
    };

    const handleFinishSelectingMembers = () => {
        const selectedMembers = members.filter(member => member.selected);
        route.params.onSelectMembers(selectedMembers);
        navigation.goBack();
    };

    const renderItem = ({ item }) => (
        <View style={styles.membercontainer}>
            <CheckBox
                value={item.selected}
                onValueChange={() => toggleMemberSelection(item.id)}
                tintColors={{true:'#6F8BED'}}                               
            />
            <Text style={styles.userlist}>{item.username}</Text>
        </View>
    );

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

                <Text style={styles.fontstyle}>Select Members</Text>
            </View>


            <FlatList
                data={members}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />

            <TouchableOpacity 
                style={styles.button}
                onPress={handleFinishSelectingMembers}
                >
                    <Text style={styles.txtbtn}>Finish</Text>
            </TouchableOpacity>

        </View>

    )


}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f9f9f9',
        flexDirection:'column'
    },

    membercontainer:{
        flexDirection:'row',
        borderWidth:1,
        paddingHorizontal:30,
        paddingVertical:10,
        borderColor:'#BABABA'
    },

    userlist:{
        color:'#333333',
        paddingTop:6
    },

    button:{
        marginHorizontal:30,
        backgroundColor:'#6F8BED',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        //paddingVertical:5
        marginBottom:30
    },

    txtbtn:{
        marginVertical:10,
        color:'#fff',
        fontSize:16
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

export default SelectMember;