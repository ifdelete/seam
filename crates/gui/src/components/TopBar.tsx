import { invoke } from '@tauri-apps/api'
import { createSignal } from 'solid-js'
import { Spinner, SpinnerType } from 'solid-spinner'
import toast from 'solid-toast'
import { Transition } from 'solid-transition-group'

import { AddIcon, SyncIcon } from '../icon/icon'
import { Resp } from '../model/Resp'
import Panel from './Panel'

const TopBar = () => {
    const [refresh, setRefresh] = createSignal(false)
    const [rid, setRid] = createSignal('')
    const [onInput, setInput] = createSignal(false)
    const [onPanel, setPanel] = createSignal(false)
    const [live, setLive] = createSignal('bili')

    const add = async () => {
        await invoke<Resp<boolean>>('add_subscribe', {
            live: live(),
            rid: rid(),
        }).then((p) => {
            if (p.code === 0) {
                console.log(p.data)
                toast.success('添加成功')
            } else {
                toast.error(p.msg)
            }
        })
    }

    return (
        <div data-tauri-drag-region class="top-bar">
            <button class="top-bar-btn">
                <div class="refresh" onClick={() => setRefresh(!refresh())}>
                    {refresh() ? (
                        <Spinner
                            type={SpinnerType.oval}
                            width={16}
                            height={16}
                        />
                    ) : (
                        <SyncIcon size={20} />
                    )}
                </div>
            </button>
            <input
                placeholder="房间号"
                class="top-bar-input"
                onFocusIn={() => {
                    setInput(true)
                }}
                onFocusOut={() => {
                    setInput(false)
                }}
                onInput={async (e) => {
                    setRid(e.target.value)
                }}
            />
            <button
                class="top-bar-btn"
                onClick={async () => {
                    await add()
                }}
            >
                <AddIcon size={16} />
            </button>
            <Transition name="slide-fade">
                {(onInput() || onPanel()) && (
                    <Panel flag={setPanel} live={live} setLive={setLive} />
                )}
            </Transition>
        </div>
    )
}

export default TopBar