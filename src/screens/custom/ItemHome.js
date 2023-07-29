import React, { useState, } from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import { connect } from "react-redux";
import { formatCurrency } from "../../common";
function ItemHome(props) {
    const item = props.item;
    navigation = props.navigation
    const food = getDetailFood(item.id_dish)
    let total = 0;
    for (let i of item.detail) {
      total += i.status != 3 ? i.price * i.quantity : 0;
    }
    const [isCancel, setIsCancel] = useState(item.status == 1)
    return (
        <View style={styles.itemOrder}>
          <View style={{ flex: 8 }}>
            <Text style={styles.textItem}>Bàn số: {item?.table}</Text>
            <Text style={styles.textItem}>Thời gian: {moment(item.time).format("HH:mm DD/MM/YYYY")}</Text>
            <Text style={styles.textItem}>Trạng thái: {listStatus[item.status - 1]}</Text>
            <Text style={styles.textItem}>Thành tiền: {formatCurrency(total)}</Text>
          </View>
          <View>
            <TouchableOpacity style={[styles.btnItem, { opacity: item.status < 3 ? 1 : 0.5 }]}
              disabled={!(item.status < 3)}
              onPress={() => { navigation.navigate('OrderDetail', { order: item }) }}
            >
              <Text>Tính tiền</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnItem, { opacity: item.status == 4 ? 0.5 : 1 }]}
              disabled={item.status == 4}
              onPress={() => { navigation.navigate('ManageOrder', { order: item }) }}
            >
              <Text>Sửa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
}
export default connect(state => {
    return state
})(ItemHome);