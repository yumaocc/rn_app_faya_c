import {DateTimeString, SearchParam} from '../fst/models';
import {DayBookingModelF, SPUDetailF, SPUF} from '../models';
import {post} from './helper';

export async function getSpuList(params: SearchParam): Promise<SPUF[]> {
  // console.log(params);
  return await post('/spu/list/with/recent', params);
}

export async function getSPUDetail(id: number): Promise<SPUDetailF> {
  const a: SPUDetailF = await post('/spu/details', {id});
  a.spuHtml = `<section class="_135editor" data-tools="135编辑器" data-id="119425">
	<section style="margin: 10px auto;">
		<section style="display: flex;justify-content: center;">
			<section>
				<section>
					<section class="assistant" style="box-sizing:border-box;width: 40px;">
						<img class="assistant" style="max-width: 100% !important;box-sizing:border-box;vertical-align:inherit;width: 100%; display: block;transform:rotate(-20deg);" src="https://bcn.135editor.com/files/images/editor_styles/37c58bca24788da1069a70c5d6aacf6d.gif" data-width="100%" draggable="false" data-ratio="1" data-w="640"/>
					</section>
				</section>
				<section style="display: flex;justify-content: center;padding: 0 15px;margin: -25px 0 0 0;align-items: center;">
					<section style="font-size: 16px;color: #3b1a13;background-color: #ffb900;border-radius: 25px;padding: 5px 20px;">
						<strong class="135brush" data-brushtype="text">万圣狂欢趴</strong>
					</section>
					<section class="assistant" style="box-sizing:border-box;width: 35px;margin: 0 0 0 -10px;">
						<img class="assistant" style="max-width: 100% !important;box-sizing:border-box;vertical-align:inherit;width: 100%; display: block;transform: rotate(10deg);" src="https://bcn.135editor.com/files/images/editor_styles/12da20df4329a09c0cdcb18c09967833.png" data-width="100%" draggable="false" data-ratio="1.140625" data-w="64"/>
					</section>
				</section>
			</section>
		</section>
		<section style="box-sizing:border-box;max-width: 100% !important;width: 100%;margin: 15px 0;" data-width="100%">
			<img style="max-width: 100% !important;box-sizing:border-box;vertical-align:inherit;width: 100%; display: block;border-radius: 15px;" src="https://bcn.135editor.com/files/images/editor_styles/5ceee5ca1e4bfca06c675131d8c1bbae.png" hm_fix="329:518" data-width="100%" draggable="false" data-ratio="0.5831842576028623" data-w="559"/>
		</section>
		<section style="">
			<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#3b1a13;background: transparent;">
				<p>
					欢乐谷万圣欢乐节百鬼夜宴震撼来袭。如果你够胆量，那就快来挑战“百鬼”夜行的惊悚万圣夜吧！保你拥有一个难忘的节日体验！
				</p>
			</section>
		</section>
	</section>
</section>
<section data-role="paragraph" class="_135editor">
	<p>
		76ajsdhj
	</p>
	<p>
		<br/>
	</p>
	<section class="_135editor" data-role="title" data-tools="135编辑器" data-id="119265">
		<section style="margin: 10px auto; display: flex; justify-content: center;">
			<section>
				<section style="display: flex;align-items: center;justify-content: center;">
					<section class="assistant" style="box-sizing:border-box;width: 20px;">
						<img class="assistant" style="max-width: 100% !important;box-sizing:border-box;vertical-align:inherit;width: 100%; display: block;" src="https://bcn.135editor.com/files/images/editor_styles/a092f95ff8c9e80f8c6d7ea4d6f6238d.png" data-width="100%" draggable="false" data-ratio="1" data-w="30"/>
					</section>
					<section style="font-size: 16px;color: #333333;text-align: center;letter-spacing: 1.5px;padding: 0 5px;">
						<strong class="135brush" data-brushtype="text">双十一狂欢购</strong>
					</section>
					<section class="assistant" style="box-sizing:border-box;width: 20px;">
						<img class="assistant" style="max-width: 100% !important;box-sizing:border-box;vertical-align:inherit;width: 100%; display: block;" src="https://bcn.135editor.com/files/images/editor_styles/a092f95ff8c9e80f8c6d7ea4d6f6238d.png" data-width="100%" draggable="false" data-ratio="1" data-w="30"/>
					</section>
				</section>
				<section style="display: flex;justify-content: center;">
					<section style="font-size: 14px;color: #ffffff;padding: 3px 15px;border-radius: 25px;background-color: #fd7b33;">
						<strong class="135brush" data-brushtype="text" hm_fix="327:867">2022.10.24-11.11</strong>
					</section>
				</section>
			</section>
		</section>
	</section>
	<section class="_135editor" data-tools="135编辑器" data-id="119004">
		<section style="margin: 10px auto;">
			<section class="box-edit">
				<section style="display: flex;justify-content: flex-start;">
					<section style="display: flex;">
						<section style="display: flex;background-color: #0654ea;padding: 0 10px;">
							<section style="font-size: 16px;letter-spacing: 1.5px;color: #ffffff;height: 30px;line-height: 30px;">
								<strong>0</strong><strong class="autonum" data-original-title="" title="">1</strong>
							</section>
							<section style="font-size: 16px;color: #ffffff;text-align: center;padding: 0 0 0 5px;height: 30px;line-height: 30px;">
								<strong class="135brush" data-brushtype="text">科技与创新</strong>
							</section>
						</section>
						<section style="box-sizing:border-box;width: 0;height: 1px;border-bottom: 30px solid #0654ea;border-right: 15px solid transparent;"></section>
					</section>
					<section style="display: flex;align-items: flex-end;margin: 0 0 0 4px;">
						<section style="box-sizing:border-box;width: 7px;height: 7px;background-color: #b0f5f2;transform: skew(25deg);"></section>
					</section>
				</section>
				<section style="border-left: 1px solid #0654ea;padding: 15px 0 15px 10px;">
					<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background: transparent;">
						<p>
							随着知识经济时代的到来，科学技术永无止境的发展及其无限的创造力，必定还会继续为人类文明作出更加巨大的贡献。
						</p>
					</section>
				</section>
			</section>
			<section class="box-edit">
				<section style="display: flex;justify-content: flex-start;">
					<section style="display: flex;">
						<section style="display: flex;background-color: #0654ea;padding: 0 10px;">
							<section style="font-size: 16px;letter-spacing: 1.5px;color: #ffffff;height: 30px;line-height: 30px;">
								<strong>0</strong><strong class="autonum" data-original-title="" title="">2</strong>
							</section>
							<section style="font-size: 16px;color: #ffffff;text-align: center;padding: 0 0 0 5px;height: 30px;line-height: 30px;">
								<strong class="135brush" data-brushtype="text">科技与创新</strong>
							</section>
						</section>
						<section style="box-sizing:border-box;width: 0;height: 1px;border-bottom: 30px solid #0654ea;border-right: 15px solid transparent;"></section>
					</section>
					<section style="display: flex;align-items: flex-end;margin: 0 0 0 4px;">
						<section style="box-sizing:border-box;width: 7px;height: 7px;background-color: #b0f5f2;transform: skew(25deg);"></section>
					</section>
				</section>
				<section style="border-left: 1px solid #0654ea;padding: 15px 0 15px 10px;">
					<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background: transparent;">
						<p hm_fix="343:441">
							随着知识经济时代的到来，科学技术永无止境的发展及其无限的创造力，必定还会继续为人类文明作出更加巨大的贡献。
						</p>
					</section>
				</section>
			</section>
			<section class="box-edit">
				<section style="display: flex;justify-content: flex-start;">
					<section style="display: flex;">
						<section style="display: flex;background-color: #0654ea;padding: 0 10px;">
							<section style="font-size: 16px;letter-spacing: 1.5px;color: #ffffff;height: 30px;line-height: 30px;">
								<strong>0</strong><strong class="autonum" data-original-title="" title="">3</strong>
							</section>
							<section style="font-size: 16px;color: #ffffff;text-align: center;padding: 0 0 0 5px;height: 30px;line-height: 30px;">
								<strong class="135brush" data-brushtype="text">科技与创新</strong>
							</section>
						</section>
						<section style="box-sizing:border-box;width: 0;height: 1px;border-bottom: 30px solid #0654ea;border-right: 15px solid transparent;"></section>
					</section>
					<section style="display: flex;align-items: flex-end;margin: 0 0 0 4px;">
						<section style="box-sizing:border-box;width: 7px;height: 7px;background-color: #b0f5f2;transform: skew(25deg);"></section>
					</section>
				</section>
				<section style="border-left: 1px solid #0654ea;padding: 15px 0 15px 10px;">
					<section data-autoskip="1" class="135brush" style="text-align: justify;line-height:1.75em;letter-spacing: 1.5px;font-size:14px;color:#333333;background: transparent;">
						<p>
							随着知识经济时代的到来，科学技术永无止境的发展及其无限的创造力，必定还会继续为人类文明作出更加巨大的贡献。
						</p>
					</section>
				</section>
			</section>
		</section>
	</section>
	<p>
		<br/>
	</p>
</section>
<section class="_135editor" data-role="paragraph">
	<p >
		<br/>
	</p>
</section>`;
  return a;
}

// 橱窗列表
export async function getShowcaseSPUList(params: SearchParam): Promise<SPUF[]> {
  return await post('/user/showcase/spu/page', params);
}

// 他人橱窗列表
export async function getOtherUserShowcase(params: SearchParam): Promise<SPUF[]> {
  return await post('/user/showcase/spu/page/other', params);
}

export async function getBookingModal(skuId: number, beginTime: DateTimeString, endTime: DateTimeString): Promise<DayBookingModelF[]> {
  return await post('/spu/date/stock/month', {skuId, beginTime, endTime});
}

export async function collectSPU(id: number): Promise<boolean> {
  return await post('/user/spu/collect/one', {id});
}

export async function joinToShowCase(id: number): Promise<boolean> {
  return await post('/user/showcase/spu/add/one', {id});
}

// 生成海报 type:1-视频，ID传mainId，2-商品，ID传spu的id
export async function getSharePoster(id: number | string, type: number): Promise<string> {
  return await post('/spu/promotional/poster', {id, type});
}
