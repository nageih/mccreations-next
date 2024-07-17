import { getCreators } from "@/app/api/auth"
import { ICreator, IUser, UserTypes } from "@/app/api/types"
import { useEffect, useRef, useState } from "react"
import styles from './CreatorSelector.module.css'
import { Plus } from "react-feather"
import { Popup } from "../../Popup/Popup"
import FormComponent from "../../Form/Form"
import Text from "../Text"
import ImageInput from "../ImageDropzone"
import { useI18n } from "@/locales/client"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"

/**
 * A selector for creators. Also allows adding new creators
 * @param value The creators that are selected
 * @param onChange The function to call when the selected creators change
 */
export default function CreatorSelector({value, onChange}: {value?: ICreator[], onChange?: (creators: ICreator[]) => void}) {
    const [creators, setCreators] = useState<ICreator[]>([])
    const [confirmRemove, setConfirmRemove] = useState(false)
    const loggedIn = useRef(false)
    const t = useI18n();

    useEffect(() => {
        const getData = async () => {
            let token = sessionStorage.getItem('jwt')
            if(token) {
                loggedIn.current = true;
                let users = await getCreators(token)
                if(users && creators) {
                    setCreators([...creators, ...users]);
                } else if(users && !value) {
                    setCreators(users)
                } else if (value) {
                    setCreators(value)
                }
            } else if(!value) {
                setCreators([{username: t('form.creators.placeholder_username'), handle: t('form.creators.placeholder_handle')}])
            } else {
                setCreators(value)
            }
        }
        getData();
    }, [])

    const saveNewCreator = (inputs: string[]) => {
        let newCreators: ICreator[] = []
        if(creators)
            newCreators = [...creators]
        newCreators.push({username: inputs[0]!, handle: (inputs[1]) ? inputs[1]: ""})
        setCreators(newCreators)
        if(onChange) {
            onChange(newCreators)
        }
    }

    const removeCreator = (idx: number) => {
        if(confirmRemove){
            let newCreators = [...creators!]
            newCreators.splice(idx, 1)
            setCreators(newCreators)
            if(onChange) {
                onChange(newCreators)
            }
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('form.creators.confirm_remove')))
            setConfirmRemove(true)
            setTimeout(() => {
                setConfirmRemove(false)
            }, 5000)
        }
    }

    return (
        <div className='field'>
            <h3 className='label'>{t('form.creators.title')}</h3>
            <div className={styles.options}>
                {creators && creators.map((creator, idx) => {return (
                    <div key={idx} className={(confirmRemove) ? styles.option_removing : styles.option} onClick={() => {removeCreator(idx)}}>{creator.username}</div>
                )})}
                <div className={styles.option} onClick={() => Popup.createPopup({content: <FormComponent id="newCreator" onSave={saveNewCreator}>
                        <Text name={t('account.username')} placeholder={t('form.creators.placeholder_username')} />
                        <Text name={t('account.handle')} placeholder={t('form.creators.placeholder_handle')} />
                     </FormComponent>, title: t('form.creators.add_creator')})}>
                    <Plus />
                </div>
            </div>
            <input type='hidden' name='creators' value={JSON.stringify(creators)}></input>
        </div>
    )
}