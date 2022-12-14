import React, { useState } from 'react'
import Button from '../../../../components/Button'
import Input from '../../../../components/Input'
import style from './style.module.scss'
import clsx from 'clsx'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { postStepContext } from '../../../../utils/MultiFormProvider'
import locationData from '../../../../assets/mockData/location.json'

const validationSchema = yup.object({
  jobName: yup.string().required('Vui lòng điền tên công việc'),
  location: yup.string().required('Vui lòng nhập nơi bạn cần quảng cáo'),
})

export const BtnControl = ({ handleClick, handlePreview, showPreview, final }) => {
  return (
    <div className={style.btnControl}>
      <Button
        contrast
        title={
          <span>
            &#10094;<span> Quay lại</span>
          </span>
        }
        className={style.back}
        onClick={() => handleClick()}
      />
      <div className={style.right}>
        {showPreview && (
          <Button
            title="Xem trước"
            className={style.preview}
            onClick={() => handlePreview()}
            type="submit"
          />
        )}

        <Button
          title={final ? 'Hoàn thành' : 'Lưu và tiếp tục'}
          className={style.next}
          type="submit"
        />
      </div>
    </div>
  )
}
export const HeaderPostJob = ({ title, path }) => {
  return (
    <div className={style.job__header}>
      <h1>{title}</h1>
      <img src={path} alt="" />
    </div>
  )
}
export const InputContainer = ({ children, className }) => {
  return <div className={clsx(className, style.job__item)}>{children}</div>
}
const Job = ({ handleClick }) => {
  const { postData, setPostData } = postStepContext()
  const [suggestion, setSuggestion] = useState(
    postData.jobBasic?.location ? postData.jobBasic?.location : ''
  )
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      jobName: postData.jobBasic?.jobName,
      location: postData.jobBasic?.location,
    },
  })

  const onSubmit = (data) => {
    const jobBasic = {
      jobName: data.jobName,
      location: suggestion,
    }
    setPostData({ ...postData, jobBasic })
    handleClick('next')
  }

  return (
    <div>
      <HeaderPostJob title="Cung cấp một vài thông tin cơ bản" path={'assets/imgJob.svg'} />
      <form className={style.job__info} onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <Input
            label="Tên công việc"
            id="jobName"
            register={register}
            required
            error={errors.jobName}
          />
        </InputContainer>
        <InputContainer>
          <Input
            label="Bạn muốn bài đăng của mình xuất hiện ở đâu"
            id="location"
            register={register}
            required
            onChange={(e) => setSuggestion(e.target.value)}
            value={suggestion}
            error={errors.location}
          />
          <div className={style.suggestion}>
            <div className={style.suggestion__container}>
              {locationData
                .filter((item) => {
                  const suggestItem = suggestion.toLowerCase()
                  const locationItem = item.name.toLowerCase()
                  return (
                    suggestItem &&
                    locationItem.startsWith(suggestItem) &&
                    locationItem != suggestItem
                  )
                })
                .map((item) => (
                  <div onClick={() => setSuggestion(item.name)} className={style.suggestion__item}>
                    {item.name}
                  </div>
                ))}
            </div>
          </div>
        </InputContainer>
        <BtnControl handleClick={handleClick} isValid={isValid} />
      </form>
    </div>
  )
}

export default Job
