import { useEffect, useState } from "react"
import { Platform } from "react-native";
import Contacts from "react-native-contacts";
import { check, RESULTS } from "react-native-permissions";
import { formatPhoneContacts, getPermission } from "../functions";
//STORES
import { store as authStore } from "../stores/auth"


export const getContacts = () => {

    //INITIAL CONSTANTS
    const { frequentUsers } = authStore.getState()

    //INITIAL STATES
    const [frequents, setFrequents] = useState<any[]>([])
    const [phone, setPhone] = useState([])

    //EFFECTS
    useEffect(() => {
        let data: any[] = [];
        Object.entries(frequentUsers).forEach(([key, value]: [string, any]) => {
            delete value['username'];
            let name = value.nameUserFrequent.replace(/[^a-zA-Z ]/g, "");
            let val = { name: name, phones: [value.codCountry + '__' + value.phone] };
            data.push(val);
            data = data.sort((a, b) => {
                if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
                if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
                return 0;
            });
            //console.log('data', JSON.stringify(data, null, 4));
            setFrequents(data)
        })
    }, [])

    return {
        frequents: frequents,
        phone: phone
    }

}

