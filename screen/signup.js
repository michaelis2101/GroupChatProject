
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid, KeyboardAvoidingView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';



const SignUp = ({navigation}) =>{
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [repeatPw, setRepeatPw] = useState('')


    const signUpHandler = () =>{
        if(password !== repeatPw){
            ToastAndroid.show('Passwords do not match', ToastAndroid.SHORT);
        }else{
            console.log(name)

            //insert user baru ke firebase auth
            firebase
                .auth()
                .createUserWithEmailAndPassword(email,password)
                .then((userCredential) => {
                    const user = userCredential.user
                    const uid = user.uid

                //insert user data ke firestore
                const userRef = firebase.firestore().collection('users')
                userRef.add({
                    userId: uid,
                    username: name,
                    email: email,
                }).then(()=>{
                    navigation.navigate('LoginScreen')
                    ToastAndroid.show('Account Created, Please Login', ToastAndroid.LONG);
                })
            })

            
        }

    }




    return(
        <KeyboardAvoidingView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={'gray'}
                onChangeText={(text) => setName(text)}
                value={name}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={'gray'}
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={'gray'}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
            />
            <TextInput
                style={styles.input}
                placeholder="Repeat Password"
                placeholderTextColor={'gray'}
                secureTextEntry
                onChangeText={(text) => setRepeatPw(text)}
                value={repeatPw}
            />

            <TouchableOpacity 
                style={styles.btn}
                onPress={signUpHandler}>
                    <Text style={styles.signupbtn}>Sign Up</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius:10,
        marginBottom: 12,
        paddingHorizontal: 10,
        color:'#000'
    },

    btn:{
        width: '100%',
        height:40,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#6F8BED',
        borderWidth:1,
        borderRadius:10,
        borderColor:'#6F8BED'

    },

    signupbtn:{
        color:'#f9f9f9'
    }

})

export default SignUp