
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid, KeyboardAvoidingView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import { useAuth } from './authcontext';


const SignIn = ({navigation})=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const loginHandler = () =>{
        login(email, password, () => {
            navigation.navigate('HomeScreen');
        });
    }


return(
    <KeyboardAvoidingView style={styles.container}>
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
            <TouchableOpacity style={styles.btn} onPress={loginHandler}>
                <Text style={styles.logintext}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.acctext}>
                Don't have an account yet?
            </Text>
            
            <TouchableOpacity onPress={()=>{navigation.navigate('RegisterScreen')}}>
                <Text style={styles.subtn}>Sign Up</Text>
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
        color:'#000',
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

    subtn:{
        textDecorationLine:'underline',
        color:'blue'
    },

    logintext:{
        color: '#f9f9f9'
    },

    acctext:{
        color:'#000'
    }



})

export default SignIn