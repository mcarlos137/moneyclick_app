import { useQuery } from "react-query"
import { request } from "../../tools/axiosUtils"

const getConfigRequest = ({ queryKey }) => {
    return request({ url: `/user/getConfig/${queryKey[1]}/OK`, method: 'get' })
}

export const getConfig = (userName: string | null) => {
    return useQuery(
        ['config', userName],
        getConfigRequest,
        {
            enabled: userName !== null,
            staleTime: 30000,
            select: (data) => getConfigData(data?.data?.result),
            onSuccess: (data) => {
                console.log('getConfigData', JSON.stringify(data, null, 4));
            },
        }
    )
}

type GetConfingData = {

}

const getConfigData = (data) => {
    //base data
    let currentBitcoinAddress = '';
    let currentEthereumAddress = '';
    let currentTronAddress = '';
    let currentDogecoinAddress = 'DTkv31pUBjJUVrD34mAWf8Cp9BgEkUtNPJ';
    let currentLitecoinAddress = 'LaYPLuQEanVCYM9TztR9FuT3ZbTJM6wHEJ';
    let currentDashAddress = 'XvMQXyarpXAbRyAZ4ckXQN8M1zLjukNDLJ';
    let currentRippleAddress = 'rV2XRbZtsGwvpRptf3WaNyfgnuBpt64cJ';
    if (data.mcWallets !== undefined && data.mcWallets.current !== undefined && data.mcWallets.current[Object.keys(data.mcWallets.current)[0]].address !== undefined) {
        currentBitcoinAddress = data.mcWallets.current[Object.keys(data.mcWallets.current)[0]].address;
    }
    if (data.mcWalletsEthereum !== undefined && data.mcWalletsEthereum.current !== undefined && data.mcWalletsEthereum.current[Object.keys(data.mcWalletsEthereum.current)[0]].address !== undefined) {
        currentEthereumAddress = data.mcWalletsEthereum.current[Object.keys(data.mcWalletsEthereum.current)[0]].address;
    }
    if (data.mcWalletsTron !== undefined && data.mcWalletsTron.current !== undefined && data.mcWalletsTron.current[Object.keys(data.mcWalletsTron.current)[0]].address !== undefined) {
        currentTronAddress = data.mcWalletsTron.current[Object.keys(data.mcWalletsTron.current)[0]].address;
    }
    let verifications = {};
    if (data.verification !== undefined) {
        Object.entries(data.verification).forEach(([key, value]: [string, any]) => {
            verifications[key] = { status: value.userVerificationStatus, fieldNames: value.fieldNames };
        });
    }
    let finalData: any = {
        currentBitcoinAddress: currentBitcoinAddress,
        currentEthereumAddress: currentEthereumAddress,
        currentTronAddress: currentTronAddress,
        currentDogecoinAddress: currentDogecoinAddress,
        currentLitecoinAddress: currentLitecoinAddress,
        currentDashAddress: currentDashAddress,
        currentRippleAddress: currentRippleAddress,
        nickName: data.nickname !== undefined ? data.nickname : '',
        phone: data.phone !== undefined ? data.phone : '',
        verifications: verifications,
        isActive: data.active,
        others: {},
        /*subscribersNormalCount: subscribersNormalCount,
        subscribersPremiumCount: subscribersPremiumCount,
        enableOneDepositVerification: enableOneDepositVerification,
        enableRequestDebitCards: enableRequestDebitCards,
        enableActivateGiftCards: enableActivateGiftCards,*/
    }
    if (data.firstName !== undefined) finalData.firstName = data.firstName
    if (data.lastName !== undefined) finalData.lastName = data.lastName
    if (data.email !== undefined) finalData.email = data.email
    if (data.description !== undefined) finalData.description = data.description
    if (data.web !== undefined) finalData.web = data.web
    if (data.instagram !== undefined) finalData.instagram = data.instagram
    if (data.twitter !== undefined) finalData.twitter = data.twitter
    if (data.facebook !== undefined) finalData.facebook = data.facebook
    if (data.youtube !== undefined) finalData.youtube = data.youtube
    if (data.tiktok !== undefined) finalData.tiktok = data.tiktok
    if (data.pinterest !== undefined) finalData.pinterest = data.pinterest
    if (data.snapchat !== undefined) finalData.snapchat = data.snapchat
    if (data.onlyFans !== undefined) finalData.onlyFans = data.onlyFans
    if (data.moneyCallRate !== undefined) finalData.moneyCallRate = data.moneyCallRate
    if (data.premiumPrice !== undefined) finalData.premiumPrice = data.premiumPrice

    if (data.typeDocumentIdentity !== undefined) finalData.others.typeDocumentIdentity = data.typeDocumentIdentity
    if (data.numberDocumentIdentity !== undefined) finalData.others.numberDocumentIdentity = data.numberDocumentIdentity
    if (data.gender !== undefined) finalData.others.gender = data.gender
    if (data.birthdate !== undefined) finalData.others.birthdate = data.birthdate
    if (data.birthplace !== undefined) finalData.others.birthplace = data.birthplace
    if (data.userDirection !== undefined) finalData.others.userDirection = data.userDirection
    if (data.fileIdentity !== undefined) finalData.others.fileIdentity = data.fileIdentity
    if (data.fileBank !== undefined) finalData.others.fileBank = data.fileBank
    if (data.fileSelfie !== undefined) finalData.others.fileSelfie = data.fileSelfie
    if (data.fileAddress !== undefined) finalData.others.fileAddress = data.fileAddress

    /*let tags = '';
    if (data.tags !== undefined) {
        tags = data.tags;
    }
    delete data.tags
    let profileImage = '';
    if (data.profileImage !== undefined) {
        profileImage = data.profileImage;
    }
    delete data.profileImage
    let enableOneDepositVerification = false;
    if (data.enableOneDepositVerification !== undefined) {
        enableOneDepositVerification = data.enableOneDepositVerification;
    }
    delete data.enableOneDepositVerification
    let enableRequestDebitCards = false;
    if (data.enableRequestDebitCards !== undefined) {
        enableRequestDebitCards = data.enableRequestDebitCards;
    }
    delete data.enableRequestDebitCards
    let enableActivateGiftCards = false;
    if (data.enableActivateGiftCards !== undefined) {
        enableActivateGiftCards = data.enableActivateGiftCards;
    }
    delete data.enableActivateGiftCards
    let subscribersNormalCount = 0;
    if (data.subscribersNormalCount !== undefined) {
        subscribersNormalCount = data.subscribersNormalCount;
    }
    delete data.subscribersNormalCount
    let subscribersPremiumCount = 0;
    if (data.subscribersPremiumCount !== undefined) {
        subscribersPremiumCount = data.subscribersPremiumCount;
    }
    delete data.subscribersPremiumCount
    let subscribedNormal = null;
    if (data.subscribedNormal !== undefined) {
        subscribedNormal = data.subscribedNormal;
    }
    delete data.subscribedNormal
    let subscribedPremium = null;
    if (data.subscribedPremium !== undefined) {
        subscribedPremium = data.subscribedPremium;
    }
    delete data.subscribedPremium
    let notification = null;
    if (data.notification !== undefined) {
        notification = data.notification;
    }
    delete data.notification
    delete data.type
    delete data.environment
    delete data.active
    delete data.operationAccount
    delete data.wallets
    delete data.automaticChange
    delete data.retailIds
    delete data.notificationToken
    delete data.flag
    delete data.otherNotificationTokens
    let others = data*/
    /*if (moneyCallRate !== '') {
        decoratedResponse['moneyCallRate'] = moneyCallRate
    }
    if (premiumPrice !== '') {
        decoratedResponse['premiumPrice'] = premiumPrice
    }
    if (tags !== '') {
        decoratedResponse['tags'] = tags
    }
    if (profileImage !== '') {
        decoratedResponse['profileImage'] = profileImage
    }
    if (subscribedNormal !== null) {
        decoratedResponse['subscribedNormal'] = subscribedNormal
    }
    if (subscribedPremium !== null) {
        decoratedResponse['subscribedPremium'] = subscribedPremium
    }
    if (notification !== null) {
        decoratedResponse['notification'] = notification
    }*/
    return finalData
};

