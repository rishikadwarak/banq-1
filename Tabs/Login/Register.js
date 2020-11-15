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
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class Register extends Component{
	constructor(){
		super()
		this.state={
			email:'',
			password:''
		}
	}
	register = ()=>{
		let email = this.state.email;
        let password = this.state.password;
		console.log(email + " " + password)
		if(email!='' && password!=''){
			auth()
			.createUserWithEmailAndPassword(email, password)
			.then(async() => {
			   await this.makeDB()
			   console.log("DB created")
			  console.log('User account created & signed in!');
			  this.props.navigation.navigate("BanQ")
			})
			.catch(error => {
			  if (error.code === 'auth/email-already-in-use') {
				console.log('That email address is already in use!');
			  }
		  
			  if (error.code === 'auth/invalid-email') {
				console.log('That email address is invalid!');
			  }
		  
			  console.error(error);
			});
		}
		else{
			Alert.alert("One of email or password not entered")
		}

	}
	
	async makeDB(){
		let userName = this.state.email
		let createdDate = new Date()
              userName = userName.split("@")
              if(userName[0].includes('.'))
              userName[0] = userName[0].replace(/[.]/g,"+");
			  let Id = userName[0];
			 await database().ref( "/Budget/" + Id + "/TotalBudget/").set({
				  Cash:0
			  })
			  await database().ref( "/Budget/" + Id + "/SpentCash/").set({
				Cash:0
			})
			let startDate = new Date().getTime()
			await database().ref( "/Budget/" + Id + "/DaySet/").set({
				Date:startDate
			})
			console.log("Done Setting DB")
	}
	render(){
		return(
			<View>
				<Text>Register</Text>
				<TextInput  placeholder="E-mail"   onChangeText = {(email)=>{this.setState({email:email})}} style={{color:'black'}}/>
              	  <TextInput  secureTextEntry={true} placeholder="Password"  onChangeText = {(password)=>{this.setState({password:password})}} style={{color:'black'}}/>
				  
				  <Button title="Move" onPress={()=>{
					  this.register()
				  }}/>
			</View>
		);
	}
}