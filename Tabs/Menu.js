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
			itemName: '',
			itemPrice: 0,
			shopName: '',
			itemPartition: '',
			addItemName: '',
			addItemPrice: 0,
			shopNames: [],
			shopPartitions: [],

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
		await database().ref("/Items").on('value', (snapshot) => {
			var shops = []
			var snPartitions = []
			snapshot.forEach((child) => {
				shops.push(child.key);
				let temp = new Object()
				temp.storeName = child.key
				temp.pickerValue = 'A'

				if (snapshot.hasChild(child.key)) {
					var shopname = child.key;
					var li = [];
					snapshot.child(shopname).forEach((child) => {
						li.push({
							name: child.key,
							price: child.val(),
						})
					})
					temp.shopItemsList = li
				}
				snPartitions.push(temp)


			})
			this.setState({ shopNames: shops, shopPartitions: snPartitions })

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

	displayShopInfo = () => {
		console.log("NEW BITCH")
		return this.state.shopNames.map((name, index) => {
			let shopName = name.toString()
			let temp = new Object()
			console.log(shopName)
			return this.state.shopPartitions.map((store_details, index) => {
				if (shopName.localeCompare(store_details.storeName) == 0) {
					temp = store_details
					console.log("inside if")
					console.log(temp.shopItemsList)
					return (
						<View>
							<View style={{ flexDirection: 'row' }}>
								<Text>{shopName}</Text>
								<Picker
									selectedValue={temp.pickerValue}
									style={{ height: 50, width: 150 }}
									onValueChange={(itemValue, itemIndex) => {
										temp.pickerValue = itemValue
										this.setState((state) => {
											let snPartitions = state.shopPartitions
											snPartitions[index].pickerValue = itemValue
											return {
												snPartitions
											}
										})
									}}>
									<Picker.Item label="Partition A" value="A" />
									<Picker.Item label="Partition B" value="B" />
								</Picker>
							</View>
							<View style={{ flexDirection: 'row' }}>
								<View style={{ flexDirection: 'column' }}>
									{
										<FlatList style={{ width: '100%' }}
											data={temp.shopItemsList}
											renderItem={({ item }) => {
												return (
													<View style={{ flexDirection: 'row' }}>
														<Text>{item.name} {" :  Rs."} {item.price} </Text>
														<TouchableOpacity style={styles.button} onPress={() => { this.spendMoney(item.name, item.price, shopName, temp.pickerValue) }}>
															<Text>  >  </Text>
														</TouchableOpacity>
													</View>)
											}} />

									}
								</View>
							</View>
							<Button title="Add" onPress={() => { console.log("Add button pressed") }} />
						</View>
					)
				}
				else
					return null
			})
		}
		)
	}

	render() {

		return (
			<View>
				<View style={styles.container}>
					<Text>Menu</Text>
				</View>
				{this.displayShopInfo()}
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
		height: 15,
	},
});