;(async () => {
	const currentUrl = new URL(document.location)
	if (currentUrl.searchParams.get('reset') !== null) {
		localStorage.removeItem('lastDeviceId')
		currentUrl.searchParams.delete('reset')
		location.href = currentUrl.toString()
	}

	const $body = document.querySelector('body')
	const $video = document.querySelector('.video')
	const $picker = document.querySelector('.picker')
	const $pickerCameraSelect = $picker.querySelector('select')
	const $handles = document.querySelectorAll('.handle')

	const handlesPositions = [
		{ x: 0, y: 0 },
		{ x: window.innerWidth, y: 0 },
		{ x: 0, y: window.innerHeight },
		{
			x: window.innerWidth,
			y: window.innerHeight,
		},
	].map((handle) => ({
		...handle,
		origin: { ...handle },
	}))

	const updateHandlesPositions = () => {
		$handles.forEach(($handle, i) => {
			$handle.style.setProperty('--x', `${handlesPositions[i].x}px`)
			$handle.style.setProperty('--y', `${handlesPositions[i].y}px`)
		})
	}

	const selectCamera = async (deviceId) => {
		localStorage.setItem('lastDeviceId', deviceId)
		const constraints = {
			video: {
				deviceId: {
					exact: deviceId,
				},
			},
			audio: false,
		}
		const stream = await navigator.mediaDevices.getUserMedia(constraints)
		$video.srcObject = stream
		$body.classList.add('show-canvas')
		updateHandlesPositions()
	}

	await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
	const cameras = (await navigator.mediaDevices.enumerateDevices()).filter(
		(device) => device.kind === 'videoinput',
	)

	const lastDeviceId = localStorage.getItem('lastDeviceId')
	if (
		lastDeviceId &&
		cameras.some((camera) => camera.deviceId === lastDeviceId)
	) {
		selectCamera(lastDeviceId)
	}
	$pickerCameraSelect.innerHTML = ''
	$pickerCameraSelect.innerHTML += `<option>Choose</option>`
	cameras.forEach((camera, i) => {
		$pickerCameraSelect.innerHTML += `<option value="${camera.deviceId}">${
			camera.label || `Camera ${i + 1}`
		}</option>`
	})

	$pickerCameraSelect.addEventListener('change', () => {
		selectCamera($pickerCameraSelect.value)
	})

	$handles.forEach(($handle, i) => {
		let offsetX = 0
		let offsetY = 0
		const onStart = (event) => {
			$handle.addEventListener('pointermove', onMove)
			$handle.setPointerCapture(event.pointerId)
			offsetX = event.clientX - handlesPositions[i].x
			offsetY = event.clientY - handlesPositions[i].y
		}
		const onMove = (event) => {
			const isMovingOrigin = event.shiftKey
			handlesPositions[i].x = event.clientX - offsetX
			handlesPositions[i].y = event.clientY - offsetY

			if (isMovingOrigin) {
				handlesPositions[i].origin.x = handlesPositions[i].x
				handlesPositions[i].origin.y = handlesPositions[i].y
			}

			updateHandlesPositions()

			const transform = (() => {
				if (isMovingOrigin) {
					return ''
				}
				const warpMatrix = Matrix.createWarpMatrix(
					[handlesPositions[0].origin.x, handlesPositions[0].origin.y],
					[handlesPositions[1].origin.x, handlesPositions[1].origin.y],
					[handlesPositions[2].origin.x, handlesPositions[2].origin.y],
					[handlesPositions[3].origin.x, handlesPositions[3].origin.y],
					[handlesPositions[0].x, handlesPositions[0].y],
					[handlesPositions[1].x, handlesPositions[1].y],
					[handlesPositions[2].x, handlesPositions[2].y],
					[handlesPositions[3].x, handlesPositions[3].y],
				)

				return (
					'matrix3d(' + Matrix.convertMatrixtoCSS(warpMatrix).join(',') + ')'
				)
			})()

			$video.style.transform = transform
		}
		const onEnd = (event) => {
			$handle.removeEventListener('pointermove', onMove)
			$handle.releasePointerCapture(event.pointerId)
		}

		$handle.addEventListener('pointerdown', onStart)
		$handle.addEventListener('pointerup', onEnd)
	})
})()
