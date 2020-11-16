import React, { Component } from 'react';
import { useState } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
	Button,
	TextInput,
	FlatList,
	Alert,
	TouchableOpacity,
	Picker,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default class Menu extends Component {

	renderSeparator = () => {
		return (
			<View
				style={{
					height: 1,
					width: "100%",
					backgroundColor: "#000",
				}}
			/>
		);
	};
	//handling onPress action  
	getListViewItem = (item) => {
		Alert.alert(item.key);
	}

	constructor() {
		super()
		this.state = {
			Id: 'rt347',
			partitions: [],
			crap: 0,
			textInput: '',
			toggle: false,
			naveenlist: [],
			suryalist: [],
			naveenPartition: 'A',
			suryaPartition: 'A',
			itemName: '',
			itemPrice: 0,
			shopName: '',
			itemPartition: '',

		}
	}
	async componentDidMount() {
		auth().onAuthStateChanged((user) => {
			// if (!user)
			// 	console.log("error has occured in authstatechanged ");
			// if (user) {
			// 	console.log("The is the user " + user);
			// 	let userName = user.email;
			// 	userName = userName.split("@")
			// 	if (userName[0].includes('.'))
			// 		userName[0] = userName[0].replace(/[.]/g, "+");
			// 	let Id = userName[0];
			// 	console.log(Id);


			// }
			//let Id = "rt347"
			console.log(Id);
			console.log("In auth chnage")
		})
		database().ref("/Items").on('value', (snapshot) => {
			//console.log(snapshot.val());
			var shops = []
			snapshot.forEach((child) => {
				shops.push(child.key);
			})
			console.log(shops);
			for (let i = 0; i < shops.length; i++) {
				if (snapshot.hasChild(shops[i])) {
					var shopname = shops[i];
					var li = [];
					snapshot.child(shopname).forEach((child) => {
						li.push({
							name: child.key,
							price: child.val(),
						})
					})
					if (i == 0)
						this.setState({ naveenlist: li });
					else
						this.setState({ suryalist: li });

				}

			}
			//var li = []
			// snapshot.forEach((subsnap) => {
			// 	// console.log(subsnap.val());

			// 	subsnap.forEach((child) => {
			// 		li.push({
			// 			name: child.key,
			// 			price: child.val(),
			// 		})
			// 	})
			// 	this.setState({ list: li })
			// })

		})
	}
	logout = () => {
		auth()
			.signOut()
			.then(() => {
				console.log('User signed out!')
				this.props.navigation.navigate("Auth")
			});
	}

	checkInput = () => {
		let val = this.state.textInput
		if (!isNaN(val) && !isNaN(parseFloat(val))) {
			val = parseInt(val)
			console.log(typeof (val), val)
		}
		else {
			console.log("Not a num")
		}


	}

	spendMoney = (boughtItem, boughtItemPrice, storeName, boughtItemPartition) => {
		var today = new Date();
		var date = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear();
		console.log(date);
		console.log(typeof (date));
		database().ref("Transactions/" + this.state.Id + "/" + date).push({
			shopName: storeName,
			itemName: boughtItem,
			itemPrice: boughtItemPrice,
			itemPartition: boughtItemPartition,

		})
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Menu</Text>
				{/* <TextInput onChangeText={(input) => { this.setState({ textInput: input }) }} /> */}
				<View style={{ flexDirection: 'row' }}>
					<Text>Naveen's Tea Shop</Text>
					<Picker
						selectedValue={this.state.naveenPartition}
						style={{ height: 50, width: 150 }}
						onValueChange={(itemValue, itemIndex) => {
							this.setState({ naveenPartition: itemValue })

						}}
					>
						<Picker.Item label="Partition A" value="A" />
						<Picker.Item label="Partition B" value="B" />
					</Picker>
				</View>
				<FlatList style={{ width: '100%' }}
					data={this.state.naveenlist}
					keyExtractor={(item) => item.key}
					renderItem={({ item }) => {
						return (
							<View style={{ flexDirection: 'row' }}>
								<Text>{item.name} {" :  Rs."} {item.price}</Text>
								<TouchableOpacity style={styles.button} onPress={() => { this.spendMoney(item.name, item.price, "Naveen's Tea Shop", this.state.naveenPartition) }}>
									<Text>  >  </Text>
								</TouchableOpacity>

							</View>)
					}} />
				<View style={{ flexDirection: 'row' }}>
					<Text>Surya Tuck Shop</Text>
					<Picker
						selectedValue={this.state.suryaPartition}
						style={{ height: 50, width: 150 }}
						onValueChange={(itemValue, itemIndex) => {
							this.setState({ suryaPartition: itemValue })

						}}
					>
						<Picker.Item label="Partition A" value="A" />
						<Picker.Item label="Partition B" value="B" />
					</Picker>
				</View>
				<FlatList style={{ width: '100%' }}
					data={this.state.suryalist}
					keyExtractor={(item) => item.key}
					renderItem={({ item }) => {
						return (
							<View style={{ flexDirection: 'row' }}>
								<Text>{item.name} {" :  Rs."} {item.price}</Text>
								{/* <Button title=">" onPress={() => { console.log("Button pressed") }} /> */}
								<TouchableOpacity style={styles.button} onPress={() => { this.spendMoney(item.name, item.price, "Surya Tuck Shop", this.state.naveenPartition) }} >
									<Text>  >  </Text>
								</TouchableOpacity>

							</View>)
					}} />

				{/* <Button title="check text input" onPress={() => { this.checkInput() }} /> */}
				<Button title="Check text input" onPress={() => { this.checkInput() }} />
				<Button title="Logout" onPress={() => { this.logout() }} />
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#777',
		padding: 8,
		margin: 10,
		width: 200,
	},
	button: {
		justifyContent: 'center',
		textAlign: 'center',
		width: 25,
		backgroundColor: 'green',
		borderRadius: 10,
		margin: 20,
		//position: 'absolute',
		//right: 0,
	},
});