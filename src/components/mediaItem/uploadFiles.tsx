import { ChangeEvent, ChangeEventHandler, DragEvent, FC, ReactNode, useEffect, useRef, useState } from "react";
import './styles.scss';
import API, { _SITE_URL, logOut, setRequest } from "../../API";
import Button from "../../ui/button/button";
import Icon from "../../ui/icon/icon";
import axios, { CancelTokenSource } from "axios";
import { getSize } from "./Item";

interface Props {
    url: string
}

const FileUpload: FC<Props> = (props: Props) => {
    const [files, setFiles] = useState<FileList | null>(null);
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const cancelTokenSource = useRef<CancelTokenSource | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(e.target.files);
        }
    };

    const handleUpload = async () => {
        if (files && files.length > 0) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }

            try {
                cancelTokenSource.current = axios.CancelToken.source();
                await API.post(props.url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                            setUploadProgress(progress);
                        }
                    },
                    cancelToken: cancelTokenSource.current.token,
                });
                setUploadProgress(0);
                console.log('Files uploaded successfully');
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('File upload cancelled');
                } else {
                    console.error('Error uploading files:', error);
                }
            }
        }
    };


    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // Добавьте стили, чтобы подсветить область при перетаскивании
        e.currentTarget.classList.add('__dragOver');
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // Удалите стили при завершении перетаскивания
        e.currentTarget.classList.remove('__dragOver');
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        // Удалите стили при завершении перетаскивания
        e.currentTarget.classList.remove('__dragOver');

        // Получаем файлы из события Drag & Drop
        const droppedFiles = e.dataTransfer.files;

        // Обновляем состояние компонента
        setFiles(droppedFiles);
    };

    const getFiles = (): File[] => {
        const arr: File[] = []
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                arr.push(file);
            }
        }
        return arr;
    }

    const getFilePreview = (file: File) => {
        if (file.type.startsWith('image/')) {
            return <img src={URL.createObjectURL(file)} alt={file.name} />;
        } else if (file.type.startsWith('video/')) {
            return <video src={URL.createObjectURL(file)} muted={true} autoPlay={true} loop={true} />;
        } else {
            return <img className="cap" src="/file.svg" alt="File" />;
        }
    };

    return (
        <div className="uploadBox">
            <input type="file" multiple onChange={handleFileChange} ref={inputRef} />

            {files?.length ?

                <div className="fileList">
                    {getFiles().map(file => {
                        return (
                            <div className="file">
                                <div className="file__preview">
                                    {getFilePreview(file)}
                                </div>
                                <div className="file__info">
                                    <div className="file__name">
                                        {file.name}
                                    </div>
                                    <div className="file__size">
                                        {getSize(file.size / 1024)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                :

                <div
                    className="uploadBox__area"
                    onClick={() => inputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="uploadBox__area_icon">
                        <Icon name="plus" />
                    </div>
                    <div className="uploadBox__area_title">
                        Выбрать файлы
                    </div>
                    <div className="uploadBox__area_subtitle">
                        До 1гб пнг жпек гиф
                    </div>
                </div>
            }
            {files?.length &&
                <>
                    <Button type="primary" onClick={handleUpload}>Загрузить файлы</Button>
                    <Button type="primary" color="red" onClick={() => setFiles(null)}>Очистить</Button>
                    <div className="uploadProgress">
                        Прогресс: {uploadProgress}%
                    </div>
                </>
            }
        </div>
    );
};

export default FileUpload;