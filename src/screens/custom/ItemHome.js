import React, { useState, } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import { connect } from "react-redux";
import moment from "moment";
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
  const listStatus = ['Đã nhận', 'Đã hoàn thành', 'Đã hủy', 'Đã than toán']
  let status = item.status - 1
  return (
    <View style={styles.itemOrder}>
      <View style={{ flex: 8 }}>
        <Text style={styles.textItem}>Bàn: {item?.table}</Text>
        <Text style={styles.textItem}>Thời gian: {moment(item.time).format("HH:mm DD/MM/YYYY")}</Text>
        <Text style={styles.textItem}>Trạng thái: {listStatus[status]}</Text>
        <Text style={styles.textItem}>Thành tiền: {formatCurrency(total)}</Text>
      </View>
      <View>
        <TouchableOpacity style={[styles.btnItem, { opacity: item.status < 3 ? 1 : 0.5 }]}
          disabled={!(item.status < 3)}
          onPress={() => { user.role !=4  ? navigation.navigate('OrderDetail', { order: item }) : navigation.navigate('Kitchen', { order: item }) }}
        >
          <Text>{user.role !=4 ? 'Tính tiền' : 'Xem chi tiết'}</Text>
        </TouchableOpacity>
        {user.role != 4 ? <TouchableOpacity style={[styles.btnItem, { opacity: item.status == 4 ? 0.5 : 1 }]}
          disabled={item.status == 4}
          onPress={() => { navigation.navigate('ManageOrder', { order: item }) }}
        >
          <Text>Sửa</Text>
        </TouchableOpacity> : null}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  itemOrder: {
    flexDirection: 'row',
    width: '100%',
    height: 150,
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  btnAdd: {
    flexDirection: 'row',
    backgroundColor: '#0080ff',
    width: 50,
    height: 50,
    alignItems: 'center',
    borderRadius: 30,
    justifyContent: 'center'
  },
  textItem: {
    color: 'black',
    fontSize: 18,
    marginBottom: 5
  },
  btnItem: { flex: 2, backgroundColor: '#00ecff99', width: 80, height: 40, marginBottom: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }
})
export default connect(state => {
  return state
})(ItemHome);