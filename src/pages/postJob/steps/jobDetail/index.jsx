import React from 'react'
import style from './style.module.scss'
import { BtnControl, HeaderPostJob, InputContainer } from '../job'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Error } from '../../../../components/Input'
import clsx from 'clsx'
import { DownArrowIcon } from '../../../../assets/icon'
import { jobDetail } from '../../../../utils/dataForOptions'
import { postStepContext } from '../../../../utils/MultiFormProvider'

export const Checkbox = ({ label, register, value, onChange, data = 'jobType', checked }) => {
  return (
    <label className={style.container}>
      <span className={style.label}>{label}</span>
      {checked ? (
        <input type="checkbox" {...register(data)} value={value} onChange={onChange} checked />
      ) : (
        <input type="checkbox" {...register(data)} value={value} onChange={onChange} />
      )}
      <span className={style.checkmark}></span>
    </label>
  )
}

export const DropdownInput = ({ register, error, label, id, listData, onChange, required }) => {
  return (
    <div className={style.dropdownContainer}>
      <label
        htmlFor="amountOfJob"
        className={clsx({
          [style.required]: required,
        })}
      >
        {label}
      </label>
      <div
        className={clsx(style.selectContainer, {
          [style.fieldInvalid]: error,
          [style.fieldValid]: !error,
        })}
      >
        {onChange ? (
          <select id={id} {...register(id)} onChange={onChange} defaultValue={''}>
            <option value="" disabled hidden />
            {listData.map((item, index) => {
              return (
                <option value={item.value} key={index}>
                  {item.label}
                </option>
              )
            })}
          </select>
        ) : (
          <select id={id} {...register(id)} defaultValue={''}>
            <option value="" disabled hidden />
            {listData.map((item, index) => {
              return (
                <option value={item.value} key={index}>
                  {item.label}
                </option>
              )
            })}
          </select>
        )}
        <DownArrowIcon className={style.arrowIcon} />
      </div>

      <Error error={error} />
    </div>
  )
}

const validationSchema = yup.object({
  jobType: yup
    .array()
    .min(1)
    .of(yup.string().required('Ph???i ch???n ??t nh???t m???t lo???i c??ng vi???c'))
    .required('Ph???i ch???n ??t nh???t m???t lo???i c??ng vi???c')
    .nullable(),
  amountOfJob: yup.string().required('Vui l??ng ch???n s??? l?????ng h???p l???'),
  amountOfWeek: yup.string().required('Vui l??ng ch???n s??? l?????ng h???p l???'),
})

const JobDetail = ({ handleClick }) => {
  const { postData, setPostData } = postStepContext()
  console.log(postData)
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      jobType: postData.jobDetail?.jobType,
      amountOfJob: postData.jobDetail?.amountOfJob,
      amountOfWeek: postData.jobDetail?.amountOfWeek,
    },
  })

  const onSubmit = (data) => {
    const jobDetail = data
    setPostData({ ...postData, jobDetail })
    handleClick('next')
  }

  return (
    <div className={style.jobDetail}>
      <HeaderPostJob title="Chi ti???t v??? c??ng vi???c" path="assets/imgDetailJob.svg" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <fieldset className={style.checkboxContainer}>
            <legend>???? l?? lo???i c??ng vi???c g?? ? </legend>
            <Checkbox label="To??n th???i gian" register={register} value={'fullTime'} />
            <Checkbox label="B??n th???i gian" register={register} value={'partTime'} />
            <Checkbox label="Th???c t???p sinh" register={register} value={'intern'} />
            <Checkbox label="Th???i v???" register={register} value="temporary" />
            <Checkbox label="D??i h???n" register={register} value="permanent" />
            <Error error={errors.jobType} />
          </fieldset>
        </InputContainer>
        <InputContainer>
          <DropdownInput
            required
            register={register}
            id={'amountOfJob'}
            error={errors.amountOfJob}
            label={'B???n mu???n thu?? bao nhi??u ng?????i cho c??ng vi???c n??y'}
            listData={jobDetail.amountOfJob}
          />
          <br />
          <DropdownInput
            required
            register={register}
            id={'amountOfWeek'}
            error={errors.amountOfWeek}
            label={'B???n c???n thu?? nhanh trong bao l??u'}
            listData={jobDetail.amountOfWeek}
          />
        </InputContainer>
        <BtnControl handleClick={handleClick} />
      </form>
    </div>
  )
}

export default JobDetail
