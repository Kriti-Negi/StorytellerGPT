import React, { useState } from 'react'
import {StyleSheet, View, Text, Systrace} from 'react-native'

export default function Message(props){

    return (
        <View style={styles.msg}>
            <Text style = {[styles.msgText, props.from == "user"? styles.humanText: styles.aiText]}>{props.messageText}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    msg: {},
    msgText: {
        color: '#fff',
        fontSize: 20,
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 20,
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#364f6b',
    },
    aiText: {
        textAlign: 'left',
        marginLeft: 20,
        marginRight: 20
    },
    humanText: {
        textAlign: 'right',
        backgroundColor: '#43dde6',
        paddingRight: 20,
        marginLeft: 20
    }
});