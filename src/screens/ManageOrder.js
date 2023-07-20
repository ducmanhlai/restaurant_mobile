import React, { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import axios from '../services/axios';
import { connect } from "react-redux";
import DropDownPicker from 'react-native-dropdown-picker';
function ManageOrder(props) {
    const navigation = props.navigation;
    const listOrder = props.listOrder;
    const [listTable, setListTable] = useState([])
    const [id_staff, setId_staff] = useState(0);
    const [listFood, setListFood] = useState([])
    const [table, setTable] = useState(0);
    const [note, setNote] = useState('');
    const [listDetail, setListDetail] = useState([]);
    const [openTable, setOpenTable] = useState(false);
    const dispatch = useDispatch();
    let VietNamDong = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    useEffect(() => {
        getListFood();
        (async () => {
            const data = (await axios.get('/api/v1/table/get')).data.data;
            let maxId = data[0].id;
            data.forEach(element => {
                if (element.id > maxId)
                    maxId = element.id
            });
            let listTmp = []
            for (let i = 1; i <= maxId; i++) {
                listTmp = [{ label: `Bàn số ${i}`, value: i }, ...listTmp]
            }
            setListTable([...listTmp])
        })()
    }, [])

    return (
        <View style={{ height: '100%', width: '100%', backgroundColor: '#f7f7f773' }}>
            <DropDownPicker
                placeholder="Chọn bàn"
                setOpen={() => { setOpenTable(!openTable) }}
                multiple={false}
                min={0}
                max={11}
                items={listTable}
                open={openTable}
                setValue={setTable}
            />
            <View>
                {listFood.length > 0 ? renderListFood() : <View><Text>ROONGX</Text></View>}
            </View>
            <View><TouchableOpacity
                onPress={() => {
                    console.log(table)
                }}
            >
                <Text>Bam</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
    function getListFood() {
        (async () => {
            const data = (await axios.get('/api/v1/food/get')).data.data
            setListFood([...data])
        })()
    }
    function renderListFood() {
        return (
            <FlatList
                columnWrapperStyle={styles.row}
                numColumns={2}
                style={{ height: '70%', backgroundColor: 'white' }}
                data={listFood}
                renderItem={itemFood}
                keyExtractor={(item) => item.id}
            />
        )
    }
    function itemFood({ index, item }) {
        return (
            <TouchableOpacity style={{ height: 160, width: 170, backgroundColor: '#bbffec57', margin: 10, borderRadius: 20, alignItems: 'center' }}>
                <Image source={{
                    uri: item.avatar,
                }}
                    style={{ height: 100, width: 150, margin: 10, borderRadius: 20 }}
                ></Image>
                <Text>{item.name}</Text>
                <Text>{VietNamDong.format(item.price)}</Text>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: "space-around"
    }
});

export default connect(state => {
    return state
})(ManageOrder);