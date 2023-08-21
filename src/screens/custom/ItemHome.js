import React, { useState, } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import * as Animatable from 'react-native-animatable';
import { connect } from "react-redux";
import moment from "moment";
import { BlurView } from "@react-native-community/blur";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { formatCurrency } from "../../common";

function ItemHome(props) {
  const item = props.item;
  const user = props.user
  navigation = props.navigation;
  const listOrder = props.listOrder;
  let total = 0;
  for (let i of item.detail) {
    total += i.status != 3 ? i.price * i.quantity : 0;
  }
  const listStatus = ['Đã nhận', 'Đã hoàn thành', 'Đã hủy', 'Đã thanh toán']
  let status = item.status - 1
  return (
    <Animatable.View style={styles.itemOrder}
      animation={'fadeIn'}
      duration={800}>
      <View style={{ flex: 8 }}>

        <View style={[styles.itemView, { marginBottom: 6 }]}>
          <Icon style={styles.icon} name='table' size={30} ></Icon>
          <View style={[{ marginLeft: 'auto', marginRight: 'auto', borderRadius: 89, borderWidth: 0.5, height: 30, width: 30, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontWeight: 'bold',fontSize:18 }}>{item?.table}</Text>
          </View>
        </View>

        <View style={styles.itemView}>
          <Icon style={styles.icon} name='clock-o' size={30} ></Icon>
          <Text style={styles.textItem}>{moment(item.time).format("HH:mm DD/MM/YYYY")}</Text>
        </View>

        <View style={styles.itemView}>
          <Icon style={styles.icon} name='question-circle-o' size={30} ></Icon>
          <Text style={styles.textItem}>{listStatus[status]}</Text>
        </View>

        <View style={styles.itemView}>
          <Icon style={styles.icon} name='money' size={30} ></Icon>
          <Text style={styles.textItem}>{formatCurrency(total)}</Text>
        </View>

      </View>
      <View style={{ justifyContent: 'space-evenly', alignItems: "center" }}>
        <TouchableOpacity style={[styles.btnItem, { opacity: item.status < 3 ? 1 : 0.5, }]}
          disabled={!(item.status < 3)}
          onPress={() => { user.role != 4 ? navigation.navigate('OrderDetail', { order: item }) : navigation.navigate('Kitchen', { order: item }) }}
        >
          <Text>{user.role != 4 ? <Icon style={styles.iconBtn} name='calculator'></Icon> : <Icon style={styles.iconBtn} name='info'></Icon>}</Text>
        </TouchableOpacity>
        {user.role != 4 ? <TouchableOpacity style={[styles.btnItem, { opacity: item.status == 4 ? 0.5 : 1 }]}
          disabled={item.status == 4}
          onPress={() => { navigation.navigate('ManageOrder', { order: item }) }}
        >
          <Icon style={styles.iconBtn} name='edit'></Icon>
        </TouchableOpacity> : null}
      </View>
    </Animatable.View>
  )
}
const styles = StyleSheet.create({
  itemView: {
    flexDirection: 'row'
  },
  icon: {
    color: '#FF3300',
    fontSize: 20,
    marginRight: 12,
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  iconBtn: { fontSize: 18, marginHorizontal: 'auto',color:'white',opacity:0.9 },
  itemOrder: {
    flexDirection: 'row',
    width: '96%',
    height: 150,
    backgroundColor: '#fff',
    marginLeft:'auto',
    marginRight:'auto',
    padding: 15,
    marginBottom: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  textItem: {
    color: '#444444',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 5
  },
  btnItem: {
    height: 36,
    backgroundColor: '#32CD32',
    width: 36,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  }
})
export default connect(state => {
  return state
})(ItemHome);