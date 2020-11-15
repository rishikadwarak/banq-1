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

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database';

export default class Wallet extends Component{
	constructor(){
		super()
		this.state={
			//Id:null,
			Id:"sn178",
			TotalBudget:0,
			SpentCash:0,
			StartDate:null,
			TextInputEdit:false,
			TotalBudgetEdit:false,
			sampleInput:"Read Only",
			daysLeft:0,
			TotalBudgetPrev:0,
			partitionBudget:0,
			partitionsSpent:0,
			partitionName:'',
			partitions:[],
			partitionsNames:[],
			togglePartition:false
		}
	}
	componentDidMount(){
        auth().onAuthStateChanged((user)=>{
         /*   if(!user)
          console.log("error has occured in authstatechanged ");
          if(user){
              let userName = user.email;
              userName = userName.split("@")
              if(userName[0].includes('.'))
              userName[0] = userName[0].replace(/[.]/g,"+");
              let Id = userName[0];
              console.log(Id);
			  this.setState({Id:Id})
			  database().ref("Budget/"+Id).once('value',snap=>{
				  this.setState({
					  TotalBudget:snap.val().TotalBudget.Total,
					  TotalBudgetPrev:snap.val().TotalBudget.Total,
					  SpentCash:snap.val().SpentCash.Cash,
					  StartDate:new Date(snap.val().DaySet.Date)
				  },()=>{
					  let tempDate = new Date(this.state.StartDate)
					  let NodaysInMonth = this.daysInMonth(tempDate.getMonth()+1,tempDate.getFullYear())	
					  console.log("Year",tempDate.getFullYear())
					  console.log(NodaysInMonth,"Days")
					  this.setState({daysLeft:NodaysInMonth-tempDate.getDate()},()=>{console.log(this.state.daysLeft,"Days left")})

					  //console.log(this.state.TotalBudget,this.state.SpentCash,this.state.StartDate.getDay())
				  })
			  })
		  }  */
		  let Id = "sn178"
		  console.log("In auth chnage")
		  database().ref("Budget/"+Id).once('value',snap=>{
			this.setState({
				TotalBudget:snap.val().TotalBudget.Total,
				TotalBudgetPrev:snap.val().TotalBudget.Total,
				SpentCash:snap.val().SpentCash.Cash,
				StartDate:new Date(snap.val().DaySet.Date)
			},()=>{
				let tempDate = new Date(this.state.StartDate)
				let NodaysInMonth = this.daysInMonth(tempDate.getMonth()+1,tempDate.getFullYear())	
				console.log("Year",tempDate.getFullYear())
				console.log(NodaysInMonth,"Days")
				this.setState({daysLeft:NodaysInMonth-tempDate.getDate()},()=>{console.log(this.state.daysLeft,"Days left")})

				//console.log(this.state.TotalBudget,this.state.SpentCash,this.state.StartDate.getDay())
			})
		})
	  })

	  }

	daysInMonth =  (month, year) => { 
		return new Date(year, month, 0).getDate(); 
	} 
	
	logout = ()=>{
		auth()
		.signOut()
		.then(() => {
			console.log('User signed out!')
			this.props.navigation.navigate("Auth")
		});
	}

	saveChanges = ()=>{
		this.setState({
			TotalBudgetPrev:this.state.TotalBudget
		})
		database().ref("Budget/"+this.state.Id + "/TotalBudget").set({
			Total:this.state.TotalBudget
		})
	}

	showButton = ()=>{
		if(this.state.TotalBudgetEdit && this.state.TotalBudgetPrev!=this.state.TotalBudget){
			return(
				<View>
					<Button title="save changes" onPress={()=>{this.saveChanges()}}/>
				</View>
			);
		}
		else{
			return null;
		}
	}

	togglePartitionView = ()=>{
		this.setState({
			togglePartition:!this.state.togglePartition
		})
	}

	savePartition = ()=>{
		let val = this.state.partitionBudget
		if (!isNaN(val) && !isNaN(parseFloat(val))){
			let newPartition = new Object()
			newPartition.name= this.state.partitionName
			newPartition.totalBudget = this.state.partitionBudget
			newPartition.spent = 0

			this.setState(state=>{
				let togglePartition = false
				let partitions = state.partitions.concat(newPartition)
				return{
					togglePartition,
					partitions
				}
			})
		}
		else
		Alert.alert("Number not entered")
	}

	showPartition = ()=>{
		if(this.state.togglePartition){
			return(
				<View style={{backgroundColor:'green'}}>
					<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
						<Text>Partiton Name</Text>
						<TextInput onChangeText = {(input)=>{this.setState({partitionName:input})}} style={{width:50,color:'red'}}/>
					</View>
					<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
					<Text>Partiton Budget</Text>
						<TextInput onChangeText = {(input)=>{this.setState({partitionBudget:input})}} />
					</View>
					<Button title="save changes" onPress={()=>{this.savePartition()}}></Button>
				</View>
			)
		}
	}
	displayPartitions = ()=>{
		if(this.state.partitions.length!=0){
			let totalPar = this.state.partitions.length
			console.log("Yeet",totalPar)
			let partitionViews = []
			for(let i;i<totalPar;++i){
				partitionViews.push(
					<View>
					<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
						<Text>Hey</Text>
						<Text>Cash Left</Text>
						<Text>{this.state.partitions[i].totalBudget - this.state.partitions[i].spent}</Text>
					</View>
					</View>

				)
			}

			return(
				<View >
					{
						this.state.partitions.map((item)=>(
							<View>
							<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'red'}}>
								<Text>Total Budget</Text>
								<Text>{item.totalBudget}</Text>
							</View>
							<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'red'}}>
								<Text>Cash Left</Text>
								<Text>{item.totalBudget - item.spent}</Text>
							</View>
							</View>
							
							
						))
					}
					
				</View>
			)
		}
		else
		return null
	}
	render(){
		return(
			<View>
				<Text>Walet</Text>
				<View style={{flexDirection:'row',justifyContent:'space-between'}}>
					<Text>Spent Today</Text>
					<Text>{this.state.SpentCash}</Text>
				</View>
				<View style={{flexDirection:'column'}}>

					<View style={{flexDirection:'row',justifyContent:'space-between'}}>
						<Text>Cash Left</Text>
						<Text>{this.state.TotalBudget - this.state.SpentCash}</Text>
					</View>
					<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
					<Text>Total Budget</Text>
					<TextInput editable = {this.state.TotalBudgetEdit}  onChangeText = {(input)=>{this.setState({TotalBudget:input})}} value={this.state.TotalBudget.toString()} style={{color:"black"}}/>
					
					</View>
					<View style={{flexDirection:'row',justifyContent:'space-between'}}>
						<Text>Days Left</Text>
						<Text>{this.state.daysLeft}</Text>
					</View>

				</View>
				{this.showButton()}
				
				<View style={{height:100}}></View>


				<Button title="add partition" onPress={()=>{this.togglePartitionView()}}/>
				{this.showPartition()}
				{this.displayPartitions()}

				<View style={{height:100}}></View >
				<Button title="Logout" onPress={()=>{this.logout()}}/>
			</View>
		);
	}
}