import React,{Component} from 'react';
import {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
    TextInput,
	Alert
  } from 'react-native';
import auth from '@react-native-firebase/auth'


  export default class Login extends Component{

	constructor(){
		super()
		this.state={
			email:'',
			password:''
		}
	}

	login = ()=>{
		let email = this.state.email;
        let password = this.state.password;
		console.log(email + " " + password)
		this.props.navigation.navigate("BanQ");
        
      /*   if(email!='' && password!=''){
          
            auth().signInWithEmailAndPassword(email,password).then((user)=>{
                this.setState({
                    user:user.user.email
                },()=>{
                  console.log("logged In")
                  this.props.navigation.navigate("BanQ");
                  
                })
            }).catch((error)=>{
                Alert.alert(error.message);
                console.log(error.message)
            })
		}
		else{
			Alert.alert("No email or password")
		} */
		
	}
	  render(){
		  return(
			  <View>
				  <Text>Login</Text>
				  <TextInput  placeholder="E-mail"   onChangeText = {(email)=>{this.setState({email:email})}} style={{color:'black'}}/>
              	  <TextInput  secureTextEntry={true} placeholder="Password"  onChangeText = {(password)=>{this.setState({password:password})}} style={{color:'black'}}/>
				  
				  <Button title="Move" onPress={()=>{
					  this.login()
				  }}/>
			  </View>
		  );
	  }
  }